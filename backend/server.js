import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*', // Allow all origins or specify your frontend URL
};
app.use(cors(corsOptions));
app.use(express.json());

const targetData = {
    totalSales: 5000000000, 
    totalNoOfGiftCardSold: 4747267, 
    giftCardSold: 4747267, 
    giftCardRedeem: 270049, 
    totalOrderLift: Math.floor(270049 * 0.45), 
    loyaltySignup: 500000,
    loyaltyPointEarn: 100000000, 
    loyaltyPointRedeem: 70000000, 
    orderPlacedUsingLoyaltyPoint: 100000, 
    orderPlacedUsingCashback: 100000, 
    orderPlacedUsingStoreCredit: 200000, 
  };
  
  let data = {
    totalSales: 0,
    totalNoOfGiftCardSold: 0, 
    giftCardSold: 0,
    giftCardRedeem: 0,
    totalOrderLift: 0,
    loyaltySignup: 0,
    loyaltyPointEarn: 0,
    loyaltyPointRedeem: 0,
    orderPlacedUsingLoyaltyPoint: 0,
    orderPlacedUsingCashback: 0,
    orderPlacedUsingStoreCredit: 0,
  };
  
  const totalDurationHours = 96;
  const updateIntervalMs = 10 * 1000;
  const totalUpdates = (totalDurationHours * 60 * 60 * 1000) / updateIntervalMs;
  
  
  const incrementSteps = {
    totalSales: targetData.totalSales / totalUpdates,
    totalNoOfGiftCardSold: targetData.totalNoOfGiftCardSold / totalUpdates, 
    giftCardSold: targetData.giftCardSold / totalUpdates,
    giftCardRedeem: targetData.giftCardRedeem / totalUpdates,
    totalOrderLift: targetData.totalOrderLift / totalUpdates,
    loyaltySignup: targetData.loyaltySignup / totalUpdates,
    loyaltyPointEarn: targetData.loyaltyPointEarn / totalUpdates,
    loyaltyPointRedeem: targetData.loyaltyPointRedeem / totalUpdates,
    orderPlacedUsingLoyaltyPoint: targetData.orderPlacedUsingLoyaltyPoint / totalUpdates,
    orderPlacedUsingCashback: targetData.orderPlacedUsingCashback / totalUpdates,
    orderPlacedUsingStoreCredit: targetData.orderPlacedUsingStoreCredit / totalUpdates,
  };
  
  
  const updateData = () => {
    data = {
      totalSales: Math.min(data.totalSales + incrementSteps.totalSales, targetData.totalSales),
      totalNoOfGiftCardSold: Math.min(data.totalNoOfGiftCardSold + incrementSteps.totalNoOfGiftCardSold, targetData.totalNoOfGiftCardSold), // Added: Update total gift cards sold
      giftCardSold: Math.min(data.giftCardSold + incrementSteps.giftCardSold, targetData.giftCardSold),
      giftCardRedeem: Math.min(data.giftCardRedeem + incrementSteps.giftCardRedeem, targetData.giftCardRedeem),
      totalOrderLift: Math.min(data.totalOrderLift + incrementSteps.totalOrderLift, targetData.totalOrderLift),
      loyaltySignup: Math.min(data.loyaltySignup + incrementSteps.loyaltySignup, targetData.loyaltySignup),
      loyaltyPointEarn: Math.min(data.loyaltyPointEarn + incrementSteps.loyaltyPointEarn, targetData.loyaltyPointEarn),
      loyaltyPointRedeem: Math.min(data.loyaltyPointRedeem + incrementSteps.loyaltyPointRedeem, targetData.loyaltyPointRedeem),
      orderPlacedUsingLoyaltyPoint: Math.min(data.orderPlacedUsingLoyaltyPoint + incrementSteps.orderPlacedUsingLoyaltyPoint, targetData.orderPlacedUsingLoyaltyPoint),
      orderPlacedUsingCashback: Math.min(data.orderPlacedUsingCashback + incrementSteps.orderPlacedUsingCashback, targetData.orderPlacedUsingCashback),
      orderPlacedUsingStoreCredit: Math.min(data.orderPlacedUsingStoreCredit + incrementSteps.orderPlacedUsingStoreCredit, targetData.orderPlacedUsingStoreCredit),
    };
  };
  
  // Start server
const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(data);
    
  });
  
  // WebSocket server
  const wss = new WebSocketServer({ server });
  
  // Broadcast data to all connected clients
  const broadcastData = () => {
    const jsonData = JSON.stringify(data);
    console.log(data);
    
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(jsonData);
        
        
      }
    });
  };
  
  // Update and broadcast data periodically
  setInterval(() => {
    updateData();
    broadcastData();
  }, updateIntervalMs);