angular.module('firebase.ref', ['firebase', 'firebase.config'])
    .factory('Ref', ['$window', 'FBURL', function($window, FBURL) {
      return new $window.Firebase(FBURL);
    }])
    .factory('UsersRef', ['$window', 'UsersURL', function($window, UsersURL) {
      return new $window.Firebase(UsersURL);
    }])
    .factory('UserMappingsRef', ['$window', 'UserMappingsURL', function($window, UserMappingsURL) {
      return new $window.Firebase(UserMappingsURL);
    }])
    .factory('EmailsRef', ['$window', 'EmailsURL', function($window, EmailsURL) {
      return new $window.Firebase(EmailsURL);
    }])
    .factory('TripsRef', ['$window', 'TripsURL', function($window, TripsURL) {
      return new $window.Firebase(TripsURL);
    }])
    .factory('CategoriesRef', ['$window', 'CategoriesURL', function($window, CategoriesURL) {
      return new $window.Firebase(CategoriesURL);
    }])
    .factory('RecommendationsRef', ['$window', 'RecommendationsURL', function($window, RecommendationsURL) {
      return new $window.Firebase(RecommendationsURL);
    }])
    .factory('GigsRef', ['$window', 'GigsURL', function($window, GigsURL) {
      return new $window.Firebase(GigsURL);
    }])
    .factory('ExperiencesRef', ['$window', 'ExperiencesURL', function($window, ExperiencesURL) {
        return new $window.Firebase(ExperiencesURL);
    }])
    .factory('ContactUsRef', ['$window', 'ContactUsURL', function($window, ContactUsURL) {
      return new $window.Firebase(ContactUsURL);
    }])
    .factory('OrderFilesRef', ['$window', 'OrderFilesURL', function($window, OrderFilesURL) {
      return new $window.Firebase(OrderFilesURL);
    }])
    .factory('InterestsRef', ['$window', 'InterestsURL', function($window, InterestsURL) {
      return new $window.Firebase(InterestsURL);
    }])
    .factory('DiscountsRef', ['$window', 'DiscountsURL', function($window, DiscountsURL) {
      return new $window.Firebase(DiscountsURL);
    }])
    .factory('LanguagesRef', ['$window', 'LanguagesURL', function($window, LanguagesURL) {
      return new $window.Firebase(LanguagesURL);
    }])
    .factory('AdvisesRef', ['$window', 'AdvisesURL', function($window, AdvisesURL) {
      return new $window.Firebase(AdvisesURL);
    }])
    .factory('LocalPaymentsRef', ['$window', 'LocalPaymentsURL', function($window, LocalPaymentsURL) {
      return new $window.Firebase(LocalPaymentsURL);
    }])
    .factory('CitiesRef', ['$window', 'CitiesURL', function($window, CitiesURL) {
      return new $window.Firebase(CitiesURL);
    }])
    .factory('ProfilesRef', ['$window', 'ProfilesURL', function($window, ProfilesURL) {
      return new $window.Firebase(ProfilesURL);
    }])
    .factory('PhotosRef', ['$window', 'PhotosURL', function($window, PhotosURL) {
      return new $window.Firebase(PhotosURL);
    }])
    .factory('VideosRef', ['$window', 'VideosURL', function($window, VideosURL) {
      return new $window.Firebase(VideosURL);
    }])
    .factory('LocationsRef', ['$window', 'LocationsURL', function($window, LocationsURL) {
      return new $window.Firebase(LocationsURL);
    }])

    .factory('RatingsRef', ['$window', 'RatingsURL', function($window, RatingsURL) {
      return new $window.Firebase(RatingsURL);
    }])

    .factory('TestimonialsRef', ['$window', 'TestimonialsURL', function($window, TestimonialsURL) {
      return new $window.Firebase(TestimonialsURL);
    }])

    .factory('TextServiceRef', ['$window', 'TextServiceURL', function($window, TextServiceURL) {
      return new $window.Firebase(TextServiceURL);
    }])

    .factory('EmailServiceRef', ['$window', 'EmailServiceURL', function($window, EmailServiceURL) {
      return new $window.Firebase(EmailServiceURL);
    }])

    .factory('SearchLocationRef', ['$window', 'SearchLocationURL', function($window, SearchLocationURL) {
      return new $window.Firebase(SearchLocationURL);
    }])
    .factory('LocationPhotosRef', ['$window', 'LocationPhotosURL', function($window, LocationPhotosURL) {
      return new $window.Firebase(LocationPhotosURL);
    }])
    .factory('PhotosLocRef', ['$window', 'PhotosLocationQueueURL', function($window, PhotosLocationQueueURL) {
      return new $window.Firebase(PhotosLocationQueueURL);
    }])
    .factory('SearchComingSoonRef', ['$window', 'SearchComingSoonURL', function($window, SearchComingSoonURL) {
      return new $window.Firebase(SearchComingSoonURL);
    }])

    .factory('ComingSoonRef', ['$window', 'ComingSoonURL', function($window, ComingSoonURL) {
      return new $window.Firebase(ComingSoonURL);
    }])


    .factory('ConnectedRef', ['$window', 'ConnectedURL', function($window, ConnectedURL) {
      return new $window.Firebase(ConnectedURL);
    }])
    .factory('PresenceRef', ['$window', 'PresenceURL', function($window, PresenceURL) {
      return new $window.Firebase(PresenceURL);
    }])

    .factory('OrdersRef', ['$window', 'OrdersURL', function($window, OrdersURL) {
      return new $window.Firebase(OrdersURL);
    }])
    .factory('ConversationsRef', ['$window', 'ConversationsURL', function($window, ConversationsURL) {
      return new $window.Firebase(ConversationsURL);
    }])

    .factory('QuestionnairesRef', ['$window', 'QuestionnairesURL', function($window, QuestionnairesURL) {
      return new $window.Firebase(QuestionnairesURL);
    }])
    .factory('FaqsRef', ['$window', 'FaqsURL', function($window, FaqsURL) {
      return new $window.Firebase(FaqsURL);
    }])
    .factory('TravelerCurrentCitiesRef', ['$window', 'TravelerCurrentCitiesURL', function($window, TravelerCurrentCitiesURL) {
      return new $window.Firebase(TravelerCurrentCitiesURL);
    }])
    .factory('TravelerOtherLocationsRef', ['$window', 'TravelerOtherLocationsURL', function($window, TravelerOtherLocationsURL) {
      return new $window.Firebase(TravelerOtherLocationsURL);
    }])

    .factory('UserStatusRef', ['$window', 'UserStatusURL', function($window, UserStatusURL) {
      return new $window.Firebase(UserStatusURL);
    }])


    .factory('CityLocationAddQueueRef', ['$window', 'CityLocationAddQueueURL', function($window, CityLocationAddQueueURL) {
      return new $window.Firebase(CityLocationAddQueueURL);
    }])
    .factory('LocationAddQueueRef', ['$window', 'LocationAddQueueURL', function($window, LocationAddQueueURL) {
      return new $window.Firebase(LocationAddQueueURL);
    }])


    .factory('StateLocationAddQueueRef', ['$window', 'StateLocationAddQueueURL', function($window, StateLocationAddQueueURL) {
      return new $window.Firebase(StateLocationAddQueueURL);
    }])
    .factory('CountryLocationAddQueueRef', ['$window', 'CountryLocationAddQueueURL', function($window, CountryLocationAddQueueURL) {
      return new $window.Firebase(CountryLocationAddQueueURL);
    }])


    .factory('LocationRemoveQueueRef', ['$window', 'LocationRemoveQueueURL', function($window, LocationRemoveQueueURL) {
      return new $window.Firebase(LocationRemoveQueueURL);
    }])
    .factory('StateLocationRemoveQueueRef', ['$window', 'StateLocationRemoveQueueURL', function($window, StateLocationRemoveQueueURL) {
      return new $window.Firebase(StateLocationRemoveQueueURL);
    }])
    .factory('CountryLocationRemoveQueueRef', ['$window', 'CountryLocationRemoveQueueURL', function($window, CountryLocationRemoveQueueURL) {
      return new $window.Firebase(CountryLocationRemoveQueueURL);
    }])


    .factory('ClientTokenRef', ['$window', 'ClientTokenURL', function($window, ClientTokenURL) {
      return new $window.Firebase(ClientTokenURL);
    }])
    .factory('PaymentTokenQueueRef', ['$window', 'PaymentTokenQueueURL', function($window, PaymentTokenQueueURL) {
      return new $window.Firebase(PaymentTokenQueueURL);
    }])
    .factory('PaymentTransactionQueueRef', ['$window', 'PaymentTransactionQueueURL', function($window, PaymentTransactionQueueURL) {
      return new $window.Firebase(PaymentTransactionQueueURL);
    }])
    .factory('OrdersCreateQueueRef', ['$window', 'OrdersCreateQueueURL', function($window, OrdersCreateQueueURL) {
      return new $window.Firebase(OrdersCreateQueueURL);
    }])
    .factory('OrdersUpdateQueueRef', ['$window', 'OrdersUpdateQueueURL', function($window, OrdersUpdateQueueURL) {
      return new $window.Firebase(OrdersUpdateQueueURL);
    }])
    .factory('OrdersConversationCreateQueueRef', ['$window', 'OrdersConversationCreateQueueURL', function($window, OrdersConversationCreateQueueURL) {
      return new $window.Firebase(OrdersConversationCreateQueueURL);
    }])
    .factory('OrdersQuestionnaireCreateQueueRef', ['$window', 'OrdersQuestionnaireCreateQueueURL', function($window, OrdersQuestionnaireCreateQueueURL) {
      return new $window.Firebase(OrdersQuestionnaireCreateQueueURL);
    }])


    .factory('EmailSignupWelcomeQueueRef', ['$window', 'EmailSignupWelcomeQueueURL', function($window, EmailSignupWelcomeQueueURL) {
      return new $window.Firebase(EmailSignupWelcomeQueueURL);
    }])

    .factory('EmailContactQueueRef', ['$window', 'EmailContactQueueURL', function($window, EmailContactQueueURL) {
      return new $window.Firebase(EmailContactQueueURL);
    }])

    .factory('EmailSignupWelcomeLocalQueueRef', ['$window', 'EmailSignupWelcomeLocalQueueURL', function($window, EmailSignupWelcomeLocalQueueURL) {
      return new $window.Firebase(EmailSignupWelcomeLocalQueueURL);
    }])
    .factory('EmailSignupVerificationQueueRef', ['$window', 'EmailSignupVerificationQueueURL', function($window, EmailSignupVerificationQueueURL) {
      return new $window.Firebase(EmailSignupVerificationQueueURL);
    }])

    .factory('InformYLCQueueRef', ['$window', 'InformYLCQueueURL', function($window, InformYLCQueueURL) {
      return new $window.Firebase(InformYLCQueueURL);
    }])
    .factory('InformTJQueueRef', ['$window', 'InformTJQueueURL', function($window, InformTJQueueURL) {
      return new $window.Firebase(InformTJQueueURL);
    }])



    .factory('EmailOrderConfirmationLocalQueueRef', ['$window', 'EmailOrderConfirmationLocalQueueURL', function($window, EmailOrderConfirmationLocalQueueURL) {
      return new $window.Firebase(EmailOrderConfirmationLocalQueueURL);
    }])
    .factory('EmailOrderConfirmationTravelerQueueRef', ['$window', 'EmailOrderConfirmationTravelerQueueURL', function($window, EmailOrderConfirmationTravelerQueueURL) {
      return new $window.Firebase(EmailOrderConfirmationTravelerQueueURL);
    }])
    .factory('EmailOrderConfirmationTJQueueRef', ['$window', 'EmailOrderConfirmationTJQueueURL', function($window, EmailOrderConfirmationTJQueueURL) {
      return new $window.Firebase(EmailOrderConfirmationTJQueueURL);
    }])
    .factory('EmailOrderConfirmationYLCQueueRef', ['$window', 'EmailOrderConfirmationYLCQueueURL', function($window, EmailOrderConfirmationYLCQueueURL) {
      return new $window.Firebase(EmailOrderConfirmationYLCQueueURL);
    }])

    .factory('EmailOrderDeclinedTravelerQueueRef', ['$window', 'EmailOrderDeclinedTravelerQueueURL', function($window, EmailOrderDeclinedTravelerQueueURL) {
      return new $window.Firebase(EmailOrderDeclinedTravelerQueueURL);
    }])
    .factory('EmailOrderDeclinedYLCQueueRef', ['$window', 'EmailOrderDeclinedYLCQueueURL', function($window, EmailOrderDeclinedYLCQueueURL) {
      return new $window.Firebase(EmailOrderDeclinedYLCQueueURL);
    }])
    .factory('EmailOrderDeclinedTJQueueRef', ['$window', 'EmailOrderDeclinedTJQueueURL', function($window, EmailOrderDeclinedTJQueueURL) {
      return new $window.Firebase(EmailOrderDeclinedTJQueueURL);
    }])

    .factory('EmailMessageSentQueueRef', ['$window', 'EmailMessageSentQueueURL', function($window, EmailMessageSentQueueURL) {
      return new $window.Firebase(EmailMessageSentQueueURL);
    }])

    .factory('EmailOrderAcceptedTravelerQueueRef', ['$window', 'EmailOrderAcceptedTravelerQueueURL', function($window, EmailOrderAcceptedTravelerQueueURL) {
      return new $window.Firebase(EmailOrderAcceptedTravelerQueueURL);
    }])
    .factory('EmailOrderCompletedTravelerQueueRef', ['$window', 'EmailOrderCompletedTravelerQueueURL', function($window, EmailOrderCompletedTravelerQueueURL) {
      return new $window.Firebase(EmailOrderCompletedTravelerQueueURL);
    }])




    .factory('EmailQuestionnaireLocalQueueRef', ['$window', 'EmailQuestionnaireLocalQueueURL', function($window, EmailQuestionnaireLocalQueueURL) {
      return new $window.Firebase(EmailQuestionnaireLocalQueueURL);
    }])
    .factory('EmailQuestionnaireTravelerQueueRef', ['$window', 'EmailQuestionnaireTravelerQueueURL', function($window, EmailQuestionnaireTravelerQueueURL) {
      return new $window.Firebase(EmailQuestionnaireTravelerQueueURL);
    }])


    .factory('ComingSoonQueueRef', ['$window', 'ComingSoonQueueURL', function($window, ComingSoonQueueURL) {
      return new $window.Firebase(ComingSoonQueueURL);
    }])
    .factory('PhotosLocationQueueRef', ['$window', 'PhotosLocationQueueURL', function($window, PhotosLocationQueueURL) {
      return new $window.Firebase(PhotosLocationQueueURL);
    }])


    //******************** TO REMOVE ******************************

    .factory('MYCityLocationAddQueueRef', ['$window', 'MYCityLocationAddQueueURL', function($window, MYCityLocationAddQueueURL) {
      return new $window.Firebase(MYCityLocationAddQueueURL);
    }])
    .factory('MYLocationAddQueueRef', ['$window', 'MYLocationAddQueueURL', function($window, MYLocationAddQueueURL) {
      return new $window.Firebase(MYLocationAddQueueURL);
    }])


    .factory('MYStateLocationAddQueueRef', ['$window', 'MYStateLocationAddQueueURL', function($window, MYStateLocationAddQueueURL) {
      return new $window.Firebase(MYStateLocationAddQueueURL);
    }])
    .factory('MYCountryLocationAddQueueRef', ['$window', 'MYCountryLocationAddQueueURL', function($window, MYCountryLocationAddQueueURL) {
      return new $window.Firebase(MYCountryLocationAddQueueURL);
    }])


    .factory('MYLocationRemoveQueueRef', ['$window', 'MYLocationRemoveQueueURL', function($window, MYLocationRemoveQueueURL) {
      return new $window.Firebase(MYLocationRemoveQueueURL);
    }])
    .factory('MYStateLocationRemoveQueueRef', ['$window', 'MYStateLocationRemoveQueueURL', function($window, MYStateLocationRemoveQueueURL) {
      return new $window.Firebase(MYStateLocationRemoveQueueURL);
    }])
    .factory('MYCountryLocationRemoveQueueRef', ['$window', 'MYCountryLocationRemoveQueueURL', function($window, MYCountryLocationRemoveQueueURL) {
      return new $window.Firebase(MYCountryLocationRemoveQueueURL);
    }]);