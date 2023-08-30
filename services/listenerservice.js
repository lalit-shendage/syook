const crypto = require("crypto");
const mongoose = require("mongoose");
const Valid = require("../models/messages"); // Adjust the model import based on your structure

exports.getDecryptedObject = async (encryptedMessage) => {
  try {
    const [iv, encryptedPayload] = encryptedMessage.split(":");
    const key = process.env.SECRET_KEY;

    const decrypter = crypto.createDecipheriv("aes-256-ctr", key, iv);
    let decryptedPayload = decrypter.update(encryptedPayload, "hex", "utf8");
    decryptedPayload += decrypter.final("utf8");

    const decryptedObject = JSON.parse(decryptedPayload);
    return decryptedObject;
  } catch (err) {
    throw Error("Error while decrypting the object");
  }
};

exports.validateObject = (decryptedObject) => {
  try {
    const { secret_key, ...objectToValidate } = decryptedObject;

    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(objectToValidate));
    const calculatedSecretKey = hash.digest("hex");

    if (secret_key !== calculatedSecretKey) {
      console.log("Wrong key");
      return {};
    }

    return objectToValidate;
  } catch (err) {
    throw Error("Error while validating the object");
  }
};

exports.saveToDb = async (validObject) => {
  try {
    const newMessage = new Valid(validObject);
    const dbResponse = await newMessage.save();
    return dbResponse;
  } catch (err) {
    throw Error("Error while saving object to database");
  }
};
