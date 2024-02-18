const express = require('express')
const router = express.Router()
const Subscriber = require('../schemas/subscriber')

//getting all
router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.getAllSubscribers();
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// //getting one
// router.get('/:id', async (req, res) => {
//     try{
//         const subscriber = await Subscriber.findSubscriber(req, res);
//         res.send(req.result.name); // Assuming req.result contains the subscriber data
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
    
// });

//getting one
router.get('/:id', Subscriber.findSubscriber, async (req, res, next) => {
  try {
    res.send(req.subscriber.name); 
  } catch (err) {
    next(err);
  }
});



//creating one
router.post('/', async (req, res) => {
    const { name, subscriber_to_channel } = req.body;
  
    try {
      // Call the addSubscriber function and pass the name, subscriber_to_channel, and res parameters
      await Subscriber.addSubscriber(name, subscriber_to_channel, res);
    } catch (error) {
      console.error('Error creating subscriber:', error);
      res.status(500).json({ message: 'Error creating subscriber' });
    }
  });

// //updating one
// router.patch('/:id', async (req, res) => {
//     if (req.body.name != null) {
//         res.result.name = req.body.name
//     }
//     if (req.body.subscriber_to_channel != null) {
//         res.result.subscriber_to_channel = req.body.subscriber_to_channel
//     }
//     try {
//         const upsub = await Subscriber.updateSubscriber(res);
//         res.json(upsub)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }
// })

//Updating one
router.patch('/:id', async (req, res) => {
    const { name, subscriber_to_channel } = req.body;
    const id = req.params.id;
    try {
        const upsub = await Subscriber.updateSubscriber(name, subscriber_to_channel, id);
        res.json(upsub);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});


// //delete one
router.delete('/:id', async (req, res) => {
    try{
        const delsub = await Subscriber.deleteSubscriber(req.params.id);
        res.json({ message: 'Deleted subscriber:', subscriber: delsub.name})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});



module.exports = router