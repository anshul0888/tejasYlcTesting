angular.module('firebase.config', [])
    .constant('FBURL', 'https://ylc.firebaseio.com')
    .constant('UsersURL', 'https://ylc.firebaseio.com/users')
    .constant('UserMappingsURL', 'https://ylc.firebaseio.com/userMappings')
    .constant('EmailsURL', 'https://ylc.firebaseio.com/emails')
    .constant('TripsURL', 'https://ylc.firebaseio.com/trips')
    .constant('GigsURL', 'https://ylc.firebaseio.com/gigs')
    .constant('CitiesURL', 'https://ylc.firebaseio.com/cities')
    .constant('CategoriesURL', 'https://ylc.firebaseio.com/categories')
    .constant('ProfilesURL', 'https://ylc.firebaseio.com/profiles')
    .constant('PhotosURL', 'https://ylc.firebaseio.com/photos')
    .constant('VideosURL', 'https://ylc.firebaseio.com/videos')
    .constant('LocationsURL', 'https://ylc.firebaseio.com/locations')
    .constant('ContactUsURL', 'https://ylc.firebaseio.com/contactus')
    .constant('RatingsURL', 'https://ylc.firebaseio.com/ratings')
    .constant('TestimonialsURL', 'https://ylc.firebaseio.com/testimonials')
    .constant('OrderFilesURL', 'https://ylc.firebaseio.com/orderFiles')
    .constant('TextServiceURL', 'https://ylc.firebaseio.com/q/text/queue')
    .constant('EmailServiceURL', 'https://ylc.firebaseio.com/q/email/queue')
    .constant('ExperiencesURL', 'https://ylc.firebaseio.com/experiences')


    .constant('ConnectedURL', 'https://ylc.firebaseio.com/.info/connected')
    .constant('PresenceURL', 'https://ylc.firebaseio.com/presence')


    .constant('OrdersURL', 'https://ylc.firebaseio.com/orders')
    .constant('ConversationsURL', 'https://ylc.firebaseio.com/conversations')
    .constant('QuestionnairesURL', 'https://ylc.firebaseio.com/questionnaires/')
    .constant('TravelerCurrentCitiesURL', 'https://ylc.firebaseio.com/travelercurrentcities/')
    .constant('TravelerOtherLocationsURL', 'https://ylc.firebaseio.com/travellerOtherLocations/')


    .constant('SearchLocationURL','https://ylc.firebaseio.com/search/locations')
    .constant('LocationPhotosURL','https://ylc.firebaseio.com/search/photos/locations')
    .constant('SearchComingSoonURL','https://ylc.firebaseio.com/search/comingsoon')

    .constant('ComingSoonURL','https://ylc.firebaseio.com/comingsoon')
    .constant('ComingSoonURL','https://ylc.firebaseio.com/localPayments')

    .constant('UserStatusURL', 'https://ylc.firebaseio.com/userstatus/')

    .constant('RecommendationsURL', 'https://ylc.firebaseio.com/recommendations')
    .constant('ClientTokenURL', 'https://ylc.firebaseio.com/client/tokens')
    .constant('InterestsURL', 'https://ylc.firebaseio.com/interests')
    .constant('LanguagesURL', 'https://ylc.firebaseio.com/languages')
    .constant('AdvisesURL', 'https://ylc.firebaseio.com/advises')
    .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous','facebook','google','twitter','github'])
    .constant('loginRedirectPath', '/login')
    .constant('FaqsURL', 'https://ylc.firebaseio.com/faqs')
    .constant('DiscountsURL', 'https://ylc.firebaseio.com/discounts')

    .constant('CityLocationAddQueueURL', 'https://ylc.firebaseio.com/q/location/add/city/queue')
    .constant('LocationAddQueueURL', 'https://ylc.firebaseio.com/q/location/add/location/queue')
    .constant('StateLocationAddQueueURL', 'https://ylc.firebaseio.com/q/location/add/state/queue')
    .constant('CountryLocationAddQueueURL', 'https://ylc.firebaseio.com/q/location/add/country/queue')

    .constant('LocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/location/remove/location/queue')
    .constant('StateLocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/location/remove/state/queue')
    .constant('CountryLocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/location/remove/country/queue')

    .constant('PaymentTokenQueueURL', 'https://ylc.firebaseio.com/q/payments/token/queue')
    .constant('PaymentTransactionQueueURL', 'https://ylc.firebaseio.com/q/payments/transaction/queue')
    .constant('OrdersCreateQueueURL', 'https://ylc.firebaseio.com/q/orders/create/queue')
    .constant('OrdersUpdateQueueURL', 'https://ylc.firebaseio.com/q/orders/update/queue')
    .constant('OrdersConversationCreateQueueURL', 'https://ylc.firebaseio.com/q/orders/conversation/create/queue')
    .constant('OrdersQuestionnaireCreateQueueURL', 'https://ylc.firebaseio.com/q/orders/questionnaire/create/queue')


    .constant('EmailSignupWelcomeQueueURL', 'https://ylc.firebaseio.com/q/email/signup/welcome/queue')
    .constant('EmailContactQueueURL', 'https://ylc.firebaseio.com/q/email/contactus/queue')

    .constant('EmailSignupWelcomeLocalQueueURL', 'https://ylc.firebaseio.com/q/email/signup/welcome/local/queue')
    .constant('InformYLCQueueURL', 'https://ylc.firebaseio.com/q/email/signup/inform/queue')
    .constant('InformTJQueueURL', 'https://ylc.firebaseio.com/q/email/signup/inform/tj/queue')

    .constant('EmailSignupVerificationQueueURL', 'https://ylc.firebaseio.com/q/email/signup/verification/queue')

    .constant('EmailOrderQuestionnaireQueueURL', 'https://ylc.firebaseio.com/q/email/order/questionnaire/queue')

    .constant('EmailOrderConfirmationLocalQueueURL', 'https://ylc.firebaseio.com/q/email/order/confirmation/local/queue')
    .constant('EmailOrderConfirmationTravelerQueueURL', 'https://ylc.firebaseio.com/q/email/order/confirmation/traveler/queue')
    .constant('EmailOrderConfirmationTJQueueURL', 'https://ylc.firebaseio.com/q/email/order/confirmation/tj/queue')
    .constant('EmailOrderConfirmationYLCQueueURL', 'https://ylc.firebaseio.com/q/email/order/confirmation/ylc/queue')

    .constant('EmailQuestionnaireLocalQueueURL', 'https://ylc.firebaseio.com/q/email/order/questionnaire/local/queue')
    .constant('EmailQuestionnaireTravelerQueueURL', 'https://ylc.firebaseio.com/q/email/order/questionnaire/traveler/queue')

    .constant('EmailOrderDeclinedTravelerQueueURL', 'https://ylc.firebaseio.com/q/email/order/declined/traveler/queue')
    .constant('EmailOrderDeclinedYLCQueueURL', 'https://ylc.firebaseio.com/q/email/order/declined/ylc/queue')
    .constant('EmailOrderDeclinedTJQueueURL', 'https://ylc.firebaseio.com/q/email/order/declined/tj/queue')


    .constant('EmailMessageSentQueueURL', 'https://ylc.firebaseio.com/q/email/message/sent/queue')

    .constant('EmailOrderCompletedTravelerQueueURL', 'https://ylc.firebaseio.com/q/email/order/completed/traveler/queue')
    .constant('EmailOrderAcceptedTravelerQueueURL', 'https://ylc.firebaseio.com/q/email/order/accepted/traveler/queue')

    .constant('ComingSoonQueueURL', 'https://ylc.firebaseio.com/q/comingsoon/signup/queue')
    .constant('PhotosLocationQueueURL', 'https://ylc.firebaseio.com/q/location/photo/queue')

    .constant('LocalLocationQueueURL', 'https://ylc.firebaseio.com/q/comingsoon/local/location/queue')


    //**************** TO REMOVE **************************
    .constant('MYCityLocationAddQueueURL', 'https://ylc.firebaseio.com/q/my/location/add/city/queue')
    .constant('MYLocationAddQueueURL', 'https://ylc.firebaseio.com/q/my/location/add/location/queue')

    .constant('MYStateLocationAddQueueURL', 'https://ylc.firebaseio.com/q/my/location/add/state/queue')
    .constant('MYCountryLocationAddQueueURL', 'https://ylc.firebaseio.com/q/my/location/add/country/queue')

    .constant('MYLocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/my/location/remove/location/queue')
    .constant('MYStateLocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/my/location/remove/state/queue')
    .constant('MYCountryLocationRemoveQueueURL', 'https://ylc.firebaseio.com/q/my/location/remove/country/queue');


