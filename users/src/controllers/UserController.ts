import { Request, Response } from "express";
import User from "../models/UserModel";
import { hashPassword, comparePassword } from "../services/UserService";
import { generateTokens, generateCookieOptions, verifyRefreshToken } from "../services/TokenService";
import jwt from 'jsonwebtoken';

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "Email ou mot de passe incorrect." });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Email ou mot de passe incorrect." });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    // Set cookies
    res.cookie('accessToken', accessToken, generateCookieOptions(new Date(Date.now() + 15 * 60 * 1000))); // 15 minutes
    res.cookie('refreshToken', refreshToken, generateCookieOptions(new Date(Date.now() + 2 * 60 * 60 * 1000))); // 2 hours

    res.status(200).json({ 
      msg: "Connexion réussie",
      userId: user._id 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: "Erreur interne du serveur." });
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ msg: "Cet email est déjà utilisé." });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: isAdmin ? true : false,
    });

    await newUser.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser._id.toString(), newUser.role);

    // Set cookies
    res.cookie('accessToken', accessToken, generateCookieOptions(new Date(Date.now() + 15 * 60 * 1000))); // 15 minutes
    res.cookie('refreshToken', refreshToken, generateCookieOptions(new Date(Date.now() + 2 * 60 * 60 * 1000))); // 2 hours

    res.status(201).json({
      msg: "Utilisateur créé avec succès",
      userId: newUser._id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: "Erreur interne du serveur." });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear cookies
    res.cookie('accessToken', '', { expires: new Date(0) });
    res.cookie('refreshToken', '', { expires: new Date(0) });
    
    res.status(200).json({ msg: "Déconnexion réussie" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ msg: "Erreur interne du serveur." });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ msg: "Token de rafraîchissement manquant" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ msg: "Token de rafraîchissement invalide" });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ msg: "Utilisateur non trouvé" });
      return;
    }

    // Generate new tokens
    const tokens = generateTokens(user._id.toString(), user.role);

    // Set new cookies
    res.cookie('accessToken', tokens.accessToken, generateCookieOptions(new Date(Date.now() + 15 * 60 * 1000)));
    res.cookie('refreshToken', tokens.refreshToken, generateCookieOptions(new Date(Date.now() + 2 * 60 * 60 * 1000)));

    res.status(200).json({ msg: "Tokens rafraîchis avec succès" });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ msg: "Token de rafraîchissement invalide" });
  }
};

const del = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.body;

  if (!_id) {
    res.status(400).json({ msg: "ID de l'utilisateur requis." });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      res.status(404).json({ msg: "Utilisateur non trouvé." });
      return;
    }

    res.status(200).json({ msg: "Utilisateur supprimé avec succès.", user });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ msg: "Erreur interne du serveur." });
  }
};

export default { login, register, logout, refreshToken, del };