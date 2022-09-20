import Twitter from 'twitter-lite';

const KEYS = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
  const client = new Twitter({
    subdomain: 'api',
    version: '1.1',
    consumer_key: KEYS.consumer_key,
    consumer_secret: KEYS.consumer_secret,
    access_token_key: req.body.accTkn,
    access_token_secret: req.body.accTknSecret,
  });

  const { source_id, target_id } = JSON.parse(req.body);

  try {
    const response = await client.get('friendships/show', {
      source_id,
      target_id,
    });

    if (
      response.relationship.source.followed_by &&
      response.relationship.target.following
    ) {
      return res.status(200).json({ twitter_follow: true });
    }
    return res.status(200).json({ twitter_follow: false });
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}
