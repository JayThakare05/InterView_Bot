import express from 'express';

const router = express.Router();

const TOPICS = {
  interview: [
    'Software developer',
    'Data analyst',
    'Marketing executive',
    'HR manager',
    'Product manager',
    'Sales executive',
    'Customer support',
    'Business analyst',
  ],
  debate: [
    'Social media is harmful to society',
    'Work from home is better than office',
    'AI will replace most jobs',
    'College education is overrated',
    'Smartphones do more harm than good',
    'Online learning is better than classroom learning',
  ],
  gd: [
    'Climate change solutions',
    'Education system reform in India',
    'Startup vs. corporate jobs',
    'Impact of technology on youth',
    'Women in leadership roles',
    'Mental health awareness',
  ],
  casual: [
    'My favourite movie or TV show',
    'My weekend plans',
    'Technology in daily life',
    'Travel and places I want to visit',
    'My hobbies and interests',
    'Food and cooking',
  ],
};

router.get('/', (req, res) => {
  res.json(TOPICS);
});

export default router;
