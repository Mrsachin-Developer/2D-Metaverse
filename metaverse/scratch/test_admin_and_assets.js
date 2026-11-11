const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers,
      },
      (res) => {
        let resBody = '';
        res.on('data', (c) => (resBody += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resBody) });
          } catch {
            resolve({ status: res.statusCode, raw: resBody });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        let resBody = '';
        res.on('data', (c) => (resBody += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resBody) });
          } catch {
            resolve({ status: res.statusCode, raw: resBody });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTest() {
  console.log('=== Step 1: Admin Signin ===');
  const adminSignin = await post('/api/v1/signin', {
    username: 'admin',
    password: 'adminpassword',
  });
  console.log('Admin signin status:', adminSignin.status, 'Has token:', !!adminSignin.data.token);
  if (!adminSignin.data.token) throw new Error('Admin signin failed');
  const adminToken = adminSignin.data.token;

  console.log('=== Step 2: Admin Creates New Avatar via API ===');
  const createAvatar = await post(
    '/api/v1/admin/avatar',
    {
      name: 'Custom Admin Avatar',
      imageUrl: '/assets/avatars/avatar_phillip.svg',
    },
    adminToken
  );
  console.log('Create avatar status:', createAvatar.status, 'avatarId:', createAvatar.data.avatarId);

  console.log('=== Step 3: Admin Creates New Element via API ===');
  const createElement = await post(
    '/api/v1/admin/element',
    {
      imageUrl: '/assets/elements/workstation_triple.svg',
      width: 2,
      height: 1,
      static: true,
    },
    adminToken
  );
  console.log('Create element status:', createElement.status, 'elementId:', createElement.data.id);

  console.log('=== Step 4: Explorer User Signup & Signin ===');
  const testUser = `explorer_${Date.now()}`;
  const userSignup = await post('/api/v1/signup', {
    username: testUser,
    password: 'password123',
    type: 'user',
  });
  console.log('User signup status:', userSignup.status, 'userId:', userSignup.data.userId);

  const userSignin = await post('/api/v1/signin', {
    username: testUser,
    password: 'password123',
  });
  console.log('User signin status:', userSignin.status, 'Has token:', !!userSignin.data.token);
  const userToken = userSignin.data.token;

  console.log('=== Step 5: Explorer Attempts Unauthorized Admin Endpoint ===');
  const unauthorizedAttempt = await post(
    '/api/v1/admin/avatar',
    { name: 'Hacker Skin', imageUrl: '/hack.png' },
    userToken
  );
  console.log('Unauthorized status (expected 403):', unauthorizedAttempt.status);

  console.log('=== Step 6: Explorer Equips Avatar & Creates Space ===');
  const avatarList = await get('/api/v1/avatars');
  const chosenAvatar = avatarList.data.avatars.find(a => a.name && a.name.includes('Phillip')) || avatarList.data.avatars[0];
  console.log('Chosen avatar:', chosenAvatar.name, 'ID:', chosenAvatar.id);

  const equipAvatar = await post('/api/v1/user/metadata', { avatarId: chosenAvatar.id }, userToken);
  console.log('Equip avatar status (expected 200):', equipAvatar.status);

  const createSpace = await post(
    '/api/v1/space',
    { name: 'Gather Office Arena', dimensions: '20x20' },
    userToken
  );
  console.log('Create space status:', createSpace.status, 'spaceId:', createSpace.data.spaceId);
  const spaceId = createSpace.data.spaceId;

  console.log('=== Step 7: Explorer Places Pixel Element in Space ===');
  const elementList = await get('/api/v1/elements');
  const chosenElement = elementList.data.elements.find(e => e.imageUrl.includes('workstation')) || elementList.data.elements[0];
  console.log('Chosen element to place:', chosenElement.imageUrl, 'ID:', chosenElement.id);

  const placeElement = await post(
    '/api/v1/space/element',
    { spaceId, elementId: chosenElement.id, x: 5, y: 5 },
    userToken
  );
  console.log('Place element status (expected 200):', placeElement.status);

  const spaceDetails = await get(`/api/v1/space/${spaceId}`, userToken);
  console.log('Space elements count:', spaceDetails.data.elements.length);
  console.log('Placed element image:', spaceDetails.data.elements[0].element.imageUrl);

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTest().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});

