const Order = require('../models/Order');
const User = require('../models/Users');
const sendEmail = require('../utils/emailSender');
const Product = require('../models/Product');
const { orderSchema } = require('../validators/orderAddressValidator');
exports.createOrder = async (req, res) => {
  try {
    //const host = req.protocol + '://' + req.get('host');
    //console.log(host);
    const { error } = orderSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { items, address } = req.body;
    let total = 0;
    const productItems = [];
    for (let item of items) {
      const product = await Product.findById(item.productId);
      //const imageUrl = `${host}/uploads/${product.image}`;
      //console.log(imageUrl);
      if (!product)
        return res.status(404).json({ message: 'Product Not Found.' });
      if (product.stock < item.quantity)
        return res.status(404).json({ message: `No enough stock available ${product.name}` });
      total += product.price * item.quantity;
      //console.log(product.image);
      productItems.push({
        productName: product.name,
        imageProduct: product.image,
        price: product.price,
        qty: item.quantity,
        productId: item.productId
      })
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount: total,
      address
    });
    //order = await Order.findById({ id });
    const userId = req.user.id;
    const user = await User.findById(userId);
    //const price = await Product.findById(productId);
    //const name = user.name;
    if (!user)
      res.status(404).json({ message: 'Invalid User and Email' });

    const email = user.email;
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    await order.save();
    let productHtml = '';
    for (let item of productItems) {
      //console.log(item.image);
      productHtml +=
        `<div class="product">
                    <img src="${item.imageProduct[0]}" alt="Test">
                    <div class="product-details">
                        <h4>${item.productName}</h4>
                        <p>Qty: ${item.qty} × ₹${item.price}</p>
                    </div>
                </div>`;
    }
    await sendEmail(
      email,
      'Your Order Have Been Placed Successfully.',
      `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      background: #ffffff;
      margin: 30px auto;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #333333;
    }
    .content {
      padding: 20px 0;
      color: #555;
    }
    .order-summary {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
    }
    .product {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .product img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 5px;
      margin-right: 15px;
    }
    .product-details {
      flex: 1;
    }
    .product-details h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      color: #333;
    }
    .product-details p {
      margin: 0;
      font-size: 14px;
      color: #777;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 15px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .btn:hover {
      background-color: #0056b3;
    }
      .address-box {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
    }
    .address-box h3 {
      margin-top: 0;
      font-size: 16px;
      color: #333;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Thank You for Your Order!</h1>
    </div>
    <div class="content">
      <p>Hi ${user.name}</p>
      <p>Your order <strong>#${order._id}</strong> was placed successfully on the Way!.</p>

      <div class="order-summary">
        <h3>Order Summary:</h3>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Payment Method:</strong> UPI Payment.</p>

        <hr style="margin: 15px 0;" />

        <h3>Your Cart:</h3>

        <!-- START PRODUCT LIST -->
        ${productHtml}
        <!-- END PRODUCT LIST -->

          <div class="address-box">
            <h3>Shipping Address</h3>
            <p>${address.fullName}</p>
            <p>${address.street}, ${address.city}, ${address.state} - ${address.pincode}</p>
            <p>${address.country}</p>
            <p>Phone: ${address.phone}</p>
          </div>
      </div>

      <a class="btn" href="#">View Order</a>
    </div>

    <div class="footer">
      <p>Need help? Contact us at kamranakthar8@gmail.com</p>
      <p>© 2025 Zayra Mart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
    );
    res.status(200).json({ message: "Order Placed", orderId: order._id });
    //console.log("User Id :" + userId);
    //console.log("Email Id :" + email);
  } catch (err) {
    res.status(500).send("Server error");
  }
};



exports.getDetailsOfOrderPlaced = async (req, res) => {
  try {
    //console.log('hello');
    const orders = await Order.find().populate('userId', 'name email ').populate({
      path: 'items.productId',
      populate: {
        path: 'category',
        model: 'category',
        select: 'name image status'
      },
      select: 'name price category image'
    })
    res.json(orders);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}



exports.updateProduct = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowStatusToUpdate = ['pending', 'delivered', 'confirmed', 'shipped', 'cancelled'];
    if (!allowStatusToUpdate.includes(status))
      return res.status(400).json({ message: "Invalid Status" });

    const updateStatus = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).
      populate('userId', 'name email').populate({
        path: 'items.productId',
        populate: { path: 'category', select: 'name' },
        select: 'name price image'
      });
    const email = updateStatus.userId.email;
    const name = updateStatus.userId.name;
    const address = updateStatus.address;
    const productItems = [];
    const total=0;
    updateStatus.items.forEach(item => {
      productItems.push({
        productName: item.productId.name,
        imageProduct: item.productId.image,
        price: item.productId.price,
        qty: item.quantity
      })
    })
    let productHtml = '';
    for (let item of productItems) {
      //console.log(item.image);
      productHtml +=
        `<div class="product">
                    <img src="${item.imageProduct[0]}" alt="Test">
                    <div class="product-details">
                        <h4>${item.productName}</h4>
                        <p>Qty: ${item.qty} × ₹${item.price}</p>
                    </div>
                </div>`;
    }
    await sendEmail(
      email,
      'Email Related To Update Of Your Items Which You Placed In Zayra Mart.',
      `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      background: #ffffff;
      margin: 30px auto;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #333333;
    }
    .content {
      padding: 20px 0;
      color: #555;
    }
    .order-summary {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
    }
    .product {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .product img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 5px;
      margin-right: 15px;
    }
    .product-details {
      flex: 1;
    }
    .product-details h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      color: #333;
    }
    .product-details p {
      margin: 0;
      font-size: 14px;
      color: #777;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 15px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .btn:hover {
      background-color: #0056b3;
    }
      .address-box {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
    }
    .address-box h3 {
      margin-top: 0;
      font-size: 16px;
      color: #333;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your Order Have Been ${status}</h1>
    </div>
    <div class="content">
      <p>Hi ${name}</p>
      <p>Your order <strong>#${orderId}</strong> was placed successfully on the Way!.</p>

      <div class="order-summary">
        <h3>Order Summary:</h3>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Payment Method:</strong> UPI Payment.</p>

        <hr style="margin: 15px 0;" />

        <h3>Your Cart:</h3>

        <!-- START PRODUCT LIST -->
        ${productHtml}
        <!-- END PRODUCT LIST -->

          <div class="address-box">
            <h3>Shipping Address</h3>
            <p>${address.fullName}</p>
            <p>${address.street}, ${address.city}, ${address.state} - ${address.pincode}</p>
            <p>${address.country}</p>
            <p>Phone: ${address.phone}</p>
          </div>
      </div>

      <a class="btn" href="#">View Order</a>
    </div>

    <div class="footer">
      <p>Need help? Contact us at kamranakthar8@gmail.com</p>
      <p>© 2025 Zayra Mart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
    )

    if (!updateStatus)
      return res.status(404).json({ message: "Order Not Found." });

    res.status(200).json({ message: 'Order updated', order: updateStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}