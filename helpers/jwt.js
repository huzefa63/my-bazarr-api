import jsonwebtoken from "jsonwebtoken";

export default function SendJwt(res,status,user,jsonRes) {
  const jwt = jsonwebtoken.sign(
    { name: user.username, id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res
    .cookie("token", jwt, {
      domain: ".my-bazarr.in", // makes cookie available on all subdomains
      path: "/",
      httpOnly: true,
      secure: true, // frontend must be HTTPS
      sameSite: "None", // required for cross-site
      maxAge: 1000 * 60 * 60, // 1 hour
    })
    .status(status)
    .json(jsonRes);
}
