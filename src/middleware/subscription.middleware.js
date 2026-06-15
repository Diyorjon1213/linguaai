import subscriptionService from "../services/subscription.service.js";
import userService from "../services/user.service.js";

// true = o'tkazib yuborsin, false = bloklash
async function checkSubscription(chatId) {
  const user = userService.getUser(chatId);

  // Sinov muddati tugamagan — ruxsat
  if (!subscriptionService.isTrialExpired(user)) {
    return true;
  }

  // Tugagan — kanalga obuna bo'lganini tekshir
  const subscribed = await subscriptionService.isSubscribed(chatId);
  return subscribed;
}

export default checkSubscription;
