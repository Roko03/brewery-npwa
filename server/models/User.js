const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserRole } = require("../types/constants");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Unesi svoje korisničko ime"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Unesi svoj email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Unesite valjan email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Unesite lozinku"],
      minLength: [6, "Lozinka mora biti duljine od 6 karaktera"],
    },
    bio: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: "USER",
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

UserSchema.methods.genereteAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      token_type: "access",
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: `${process.env.JWT_ACCESS_LIFETIME}`,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      token_type: "refresh",
      name: this.name,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: `${process.env.JWT_REFRESH_LIFETIME}`,
    }
  );
};

UserSchema.methods.comparePassword = async function (pwd) {
  const isMatch = await bcrypt.compare(pwd, this.password);
  return isMatch;
};

const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema, "user");

module.exports = UserModel;
