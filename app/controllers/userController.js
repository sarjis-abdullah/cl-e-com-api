const { userRegisterSchema } = require('../middlewares/userMiddleware');
const Model = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv     = require("dotenv");
const { userResource, userResourceCollection } = require('../resources/userResources');
const User = require('../models/userModel');
const { useNodeMailer } = require('../utils');

dotenv.config();

const getUser = (dbUser)=> {
  const response = dbUser.toObject();
  delete response.password
  return response
}

exports.getAll = async (req, res) => {
  try {
    const items = await Model.find().select('-password').lean();
    const response = userResourceCollection(items)
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const newUser = new Model(req.body);
    const savedUser = await newUser.save();
    const response = userResource(savedUser)
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await Model.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const response = userResource(user)

    res.json({ token, user: response });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(userResource(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log(req.body.updatedBy, req.params.id);
    if (req.body.updatedBy !== req.params.id) {
      return res.status(403).json({ message: 'Un-authorized access denied!' });
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(userResource(item));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.body.token;
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    
    jwt.verify(resetToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const email = decoded.email;

      // Find the user with the provided email
      const user = await User.findOne({email});

      if (!user || !user.resetToken) {
        return res.status(404).json({ message: !user.resetToken ? 'Something went wrong' : 'User not found' });
      }

      // Update the user's password (you should hash the password in a real application)
      await User.updateOne({ email }, { $set: { password: newPassword, resetToken: null } });

      // Redirect the user to the login page or send a success response
      res.status(200).json({ message: 'Password reset successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.handleForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT with a 1-minute expiration time
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1m' });

    // Update the user with the reset token
    await User.updateOne({ email }, { $set: { resetToken } });

    // Send an email with the reset token
    const THIS_API_URL = process.env.THIS_API_URL
    const mailOptions = {
      from: 'no-reply@medicare.com',
      to: email,
      subject: 'Password Reset',
      html: `
      <p>Hello,</p>
      <p>Click on the following link to reset your password: </p>
      <div>
      <a href="${THIS_API_URL + resetToken}">Reset password</a>
      </div>
      <p>Thank you!</p>
    `,
    };

    useNodeMailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Password reset link sent to your email' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};