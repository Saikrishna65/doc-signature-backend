import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", tokenDecode);

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized Login again",
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
