'use strict';

module.exports = function($scope, $state, accountService, appLocalStorage/*, promises*/) {

    /**
     * Create main a variable for the current object
     */
    var vm = this;

    var privateAPI = {

        /**
         * Function parse the user data of array
         * Get firstName
         * Get lastName
         */
        getUserNameParam: function(userData) {
            var trimUserData = userData.trim();
            var arrUserData = trimUserData.split(' ');
            var processedArrUserData = _.without(arrUserData, '');

            if (processedArrUserData.length == 2) {
                vm.model.userNameParam.firstName = processedArrUserData[0].trim(); 
                vm.model.userNameParam.lastName = (_.without(processedArrUserData, processedArrUserData[0])).join(' ').trim();
            } else {
                vm.model.userNameParam.firstName = trimUserData;
                vm.model.userNameParam.lastName = '';
            }
        },

        /**
         * Function API - get user by Id
         * Function prepered
         * That function is not used
         */
        getUserById: function(userId) {
            accountService.getUserById(userId)
                .then(
                    function(userData) {
                        privateAPI.updateUserData(userData.data);
                    },
                    function(errorMessage) {
                        privateAPI.errorMessage(errorMessage);
                    }
                );
        },

        /**
         * Function API update for data localstorage
         */
        updateUserData: function(userName) {
            var userData = appLocalStorage.getItem('userData');
            userData.userName = userName;
            appLocalStorage.setItem('userData', userData);
        },

        /**
         * Function API of update information - user email.
         */
        updateUserName: function(userId, userName) {
            accountService.updateUserName(userId, userName)
                .then(
                    function(result) {
                        privateAPI.updateUserData(result.data.name);
                    },
                    function(errorMessage) {
                        privateAPI.errorMessage(errorMessage);
                    }
                );
        },

        /**
         * Function API of update information - user email.
         */
        updateUserEmail: function(userId, userEmail) {
            accountService.updateUserEmail(userId, userEmail)
                .then(
                    function(result) {
                        var userData = appLocalStorage.getItem('userData');
                        userData.userEmail = userEmail;
                        appLocalStorage.setItem('userData', userData);
                    },
                    function(errorMessage) {
                        privateAPI.errorMessage(errorMessage);
                    }
                );
        },

        /**
         * The function to display information in warning
         */
        errorMessage: function(errorMsg) {
            console.warn(errorMsg);
        }

    };

    /**
     * Initializing functions
     */
    var init = function() {
        vm.model = model;
        vm.viewAPI = viewAPI;
    };

    /**
     * Creating model as object and installing default setting.
     */
    var model = {
        pageTitle: $state.current.data.pageTitle,
        userData: appLocalStorage.getItem('userData'),
        userNameParam: {
            firstName: '',
            lastName: ''
        },
        inptUserEmail: document.getElementById("inpt-user-email"),
        isVisibilityFormUserName: true,
        isVisibilityFormUserEmail: true,
    };

    /**
     * Object contains the functions 
     * that provide actions for the elements in the DOM.
     */
    var viewAPI = {

        /**
         * Event on UI - edit
         * The function to change the user Name
         */
        editUserName: function() {
            privateAPI.getUserNameParam(vm.model.userData.userName);
            return vm.model.isVisibilityFormUserName = !vm.model.isVisibilityFormUserName;
        },

        /**
         * Event on UI - cancel
         * Function to cancel the change by user Name
         * Return form is default state
         */
        btnCancelUserName: function() {
            return vm.model.isVisibilityFormUserName = !vm.model.isVisibilityFormUserName;
        },

        /**
         * Event on UI - save
         * Function to save the change by user Name
         */
        btnSaveUserName: function() {
            var isEmptyUserFirstName = _.isEmpty(vm.model.userNameParam.firstName);
            var isEmptyUserLastName = _.isEmpty(vm.model.userNameParam.lastName);

            if (!isEmptyUserFirstName || !isEmptyUserLastName) {
                vm.model.userData.userName = _.values(vm.model.userNameParam).join(' ');
                privateAPI.updateUserName(vm.model.userData.userId, vm.model.userData.userName);
                vm.viewAPI.btnCancelUserName();
            } else {
                privateAPI.errorMessage('is not allowed');
            }
        },

        /**
         * Event on UI - edit
         * The function to change the user's email
         */
        editUserEmail: function() {
            vm.model.inptUserEmail.removeAttribute("disabled");
            return vm.model.isVisibilityFormUserEmail = !vm.model.isVisibilityFormUserEmail;
        },

        /**
         * Event on UI - cancel
         * Function to cancel the change by email
         */
        btnCancelUserEmail: function() {
            vm.model.inptUserEmail.setAttribute('disabled','disabled');
            return vm.model.isVisibilityFormUserEmail = !vm.model.isVisibilityFormUserEmail;
        },

        /**
         * Event on UI - save
         * Function to save the change by email
         */
        btnSaveUserEmail: function() {
            var isEmptyInptUserEmail = _.isEmpty(vm.model.inptUserEmail.value.trim());
            var isEqualEmail = (vm.model.inptUserEmail.value === vm.model.userData.userEmail);
            if (!isEmptyInptUserEmail && !isEqualEmail) {
                privateAPI.updateUserEmail(vm.model.userData.userId, vm.model.inptUserEmail.value);
                vm.model.userData.userEmail = vm.model.inptUserEmail.value;
            } else {
                privateAPI.errorMessage('Is not allowed');
            }
            vm.viewAPI.btnCancelUserEmail();
        },

        /**
         * Event on UI - reset password
         * The function to reset the password
         */
        resetPassword: function() {
            privateAPI.errorMessage('is not allowed');
        }

    };

    /**
     * Starts controller
     */
    init();

};
