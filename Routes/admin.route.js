import { Router } from "express";
import { Admin, Course } from "../Db/index.js";
import jwt from "jsonwebtoken";
import AdminAuth from "../Middleware/adminAuth.js";
import { courseSchema } from "../Zod/course.zod.js";
import { adminSchema } from "../Zod/admin.zod.js";

const adminRouter = Router();
adminRouter.post("/signup", async (req, res) => {
  const validatedAdmin = adminSchema.safeParse(req.body)
  if(!validatedAdmin.success){
    return res.status(401).json({
        msg:"zod validation failed"
    })
  }
  const {username , password} = validatedAdmin.data
   
  const UserExists = await Admin.findOne({
    username:username,
    password:password
  })
  if(!UserExists){
    await Admin.create({
      username: username,
      password: password,
    });
    console.log("the control reaches here");
    res.send("User created successfully");
  }
  else{
    return res.send("User already exists")
  }

  
});

adminRouter.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(process.env.JWT_SECRET);
  const user = await Admin.findOne({
    username: username,
    password: password,
  });
  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      process.env.JWT_SECRET
    );
    res.send(token);
  } else {
    res.status(411).json({
      message: "Incorrect email or password",
    });
  }
});

adminRouter.post("/courses", AdminAuth, async (req, res) => {
  // TODO: Add validation with zod
  const validatedCourse = courseSchema.safeParse(req.body);

  if (!validatedCourse.success) {
    return res.status(401).json({
      error: "Invalid Body",
      errorMessage: validatedCourse.error.errors[0].message,
    });
  }

  const { price, title } = validatedCourse.data;

  // TODO: Check if course already exists

  const course = await Course.create({
    title: title,
    price: price,
  });

  res.status(201).json({ title: course.title, price: course.price });
});
export default adminRouter;
