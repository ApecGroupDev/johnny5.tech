const { getServerSession } = require('next-auth');
const { authOptions } = require('../../../lib/auth');
const DATA = require('./_data.json');
module.exports = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) { res.status(401).json({ error: 'auth' }); return; }
  const { cards, ...rest } = DATA; // map doesn't need the heavy per-project cards
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(rest);
};
