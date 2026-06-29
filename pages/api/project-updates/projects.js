const { getServerSession } = require('next-auth');
const { authOptions } = require('../../../lib/auth');
const DATA = require('./_data.json');
module.exports = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) { res.status(401).json({ error: 'auth' }); return; }
  const list = DATA.projects.map(p => ({ id: p.id, name: p.name, company: p.company, city: p.city, status: p.status }))
                            .sort((a, b) => a.name.localeCompare(b.name));
  res.status(200).json({ projects: list, generated: DATA.generated });
};
