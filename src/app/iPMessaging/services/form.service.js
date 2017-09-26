angular.module('com.ylc.iPMessaging')
    .factory('FormService', function ($http,YLC_API) {
    	return {
    		saveForm: function (data) {
    			// return $http.post('http://localhost:3000/forms', data)
                return $http.post(YLC_API + 'forms', data)
    		},
    		getForm: function (formId) {
    			return $http.get(YLC_API + 'forms/' + formId)
    		}
    	}
    })
