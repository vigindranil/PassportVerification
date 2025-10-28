export const redirectToPaymentStatus = async (req, res) => {
  try {
    const { encData, cs, src } = req.body;

    if (!encData || !cs || !src) {
      return res.status(400).json({
        status: 1,
        message: "Missing required fields: encData, cs, or src",
      });
    }
    // return res.status(400).json({
    //   encData: encData || "", 
    //   cs: cs || "" , 
    //   src: src || "" 
    // });

    // Construct redirect URL
    const redirectUrl = `http://localhost:5173/user/paymentstatus?encData=${encodeURIComponent(
      encData
    )}&cs=${encodeURIComponent(cs)}&src=${encodeURIComponent(src)}`;

    return res.redirect(302, redirectUrl);
  } catch (error) {
    return res.status(500).json({
      status: 1,
      message: "An error occurred while redirecting to payment status",
      error: error.message,
    });
  }
};
