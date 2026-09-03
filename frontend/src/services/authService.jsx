const FAKE_DELAY = 600; 

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockUsers() {
  return JSON.parse(localStorage.getItem("mockUsers") || "[]");
}

function saveMockUsers(users) {
  localStorage.setItem("mockUsers", JSON.stringify(users));
}

export async function registerUser({ name, email, password }) {
  await delay(FAKE_DELAY);

  const users = getMockUsers();
  const exists = users.some((u) => u.email === email);

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password, 
    role: "Member", 
  };

  users.push(newUser);
  saveMockUsers(users);

  return { message: "Account created" };
}

export async function loginUser({ email, password }) {
  await delay(FAKE_DELAY);

  const users = getMockUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const fakeToken = `mock-token-${user.id}`;

  return {
    token: fakeToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}