const crypto = require("crypto");
const fs = require("fs");

// Read data from data.json
const dataFile = fs.readFileSync("data.json", "utf8");
const data = JSON.parse(dataFile);
console.log(data)

exports.generateRandomMessage = () => {
    console.log(data)
    const currentTime = new Date();
    console.log('Current time:', currentTime);
  const names = data.names;
  const cities = data.cities;

  // Generate a random index for selecting names and cities
  const randomNameIndex = Math.floor(Math.random() * names.length);
  const randomOriginIndex = Math.floor(Math.random() * cities.length);
  const randomDestinationIndex = Math.floor(Math.random() * cities.length);

  // Create the random message
  const randomMessage = {
    name: names[randomNameIndex],
    origin: cities[randomOriginIndex],
    destination: cities[randomDestinationIndex],
  };

  // Generate the secret_key using sha-256 hash of randomMessage
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(randomMessage));
  const secret_key = hash.digest("hex");

  // Add the secret_key to the random message
  const sumCheckMessage = {
    ...randomMessage,
    secret_key,
  };

  return sumCheckMessage;
};

exports.addHashToObject = (transformedObject) => {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(transformedObject));
  const hashedValue = hash.digest("hex");
  transformedObject.secret_key = hashedValue;

  return transformedObject;
};

exports.encryptObject = (transformedObjectWithHash) => {
  const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
  const key = process.env.SECRET_KEY;
  const message = JSON.stringify(transformedObjectWithHash);

  const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);
  let encryptedMessage = encrypter.update(message, "utf8", "hex");

  return `${iv}:${encryptedMessage}`;
};
