const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const constants = require("../../config/constants");

const generateRandomString = (length, pattern) => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const characters = alphabets + numbers;
  let pick = "A";
  let randomString = "";

  for (var i = 0; i < length; i++) {
    if (
      typeof pattern != "undefined" &&
      /^[ADad]+$/.test(pattern) &&
      typeof pattern[i] != "undefined"
    )
      pick = pattern[i];
    let character = "";
    if (pick === "A" || pick === "a")
      character = alphabets.charAt(
        Math.floor(Math.random() * alphabets?.length)
      );
    else if (pick === "D" || pick === "d")
      character = numbers.charAt(Math.floor(Math.random() * numbers?.length));
    else
      character = characters.charAt(
        Math.floor(Math.random() * characters?.length)
      );

    randomString += character;

    pick = null;
  }

  return randomString;
};

const generateRandomPassword = async () => {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(constants?.SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const generateJwtToken = async (payload, secret, options) => {
  return options
    ? jwt.sign(payload, secret, options)
    : jwt.sign(payload, secret);
};

const generateUUID = async () => {
  return uuidv4();
};

module.exports = {
  generateRandomString,
  generateRandomPassword,
  generatePasswordHash,
  generateJwtToken,
  generateUUID,
};
