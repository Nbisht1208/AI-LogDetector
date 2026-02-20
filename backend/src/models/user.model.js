import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "analyst"], default: "analyst" }
});


// Option 1: async/await style (recommended)
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   this.password = await bcrypt.hash(this.password, 10);
// });



// userSchema.methods.matchPassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

export default mongoose.model("User", userSchema);
