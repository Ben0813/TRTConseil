import bcrypt from 'bcrypt';

export const hashPassword = async (req, res, next) => {
  console.log('Middleware hashPassword appelé');
  const { password } = req.body;
  console.log('Mot de passe reçu:', password);
  if (password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      req.body.password = hashedPassword;
      next();
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du hachage du mot de passe." });
    }
  } else {
    next();
  }
};

