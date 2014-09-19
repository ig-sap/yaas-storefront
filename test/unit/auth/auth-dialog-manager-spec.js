/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('AuthDialogManager', function () {

    var AuthDialogManager, dialogPromise, $q, $location;
    var mockedSettings = {};
    var mockedModal = {};
    var mockedDialog = {};

    beforeEach(function(){
        module('ds.auth');

        module(function($provide){
            $provide.value('$modal', mockedModal);
            $provide.value('settings', mockedSettings);
        });

        inject(function(_$q_, _$location_, _AuthDialogManager_) {

            $q = _$q_;
            $location = _$location_;
            AuthDialogManager = _AuthDialogManager_;
        });

        dialogPromise = $q.defer();

        mockedDialog.close = jasmine.createSpy('close');
        mockedDialog.result = dialogPromise.promise;
        dialogPromise.resolve({});
        mockedModal.open =  jasmine.createSpy('open').andReturn(mockedDialog);
    });


    describe('initialization', function(){
        it('should expose correct interface', function () {
            expect(AuthDialogManager.isOpened).toBeDefined();
            expect(AuthDialogManager.open).toBeDefined();
            expect(AuthDialogManager.close).toBeDefined();
        });
    });

    describe('open()', function(){

        var options = {
            templateUrl: 'abc.html',
            controller: 'SomeCtrl'
        };

        it('should open the dialog by delegating call to $modal instance with options', function() {
            AuthDialogManager.open(options);
            expect(mockedModal.open).toHaveBeenCalledWith(options);

            mockedModal.open.reset();
            var expectedOptions = angular.copy(options);
            expectedOptions.keyboard = false;
            expectedOptions.backdrop = 'static';

            AuthDialogManager.open(expectedOptions, {required: true});

            expect(mockedModal.open).toHaveBeenCalledWith(expectedOptions);
        });

        it('should return promise for dialog closure', function(){
            var onSuccess = jasmine.createSpy('success');
            var onFailure = jasmine.createSpy('failure');
            var resultPromise = AuthDialogManager.open(options);
            resultPromise.then(onSuccess, onFailure);
            expect(resultPromise).toBeTruthy();
            expect(resultPromise.then).toBeTruthy();
            //expect(onSuccess).toHaveBeenCalled();
            //expect(onFailure).toHaveBeenCalled();
        });

        it('should convey the state of <<open>>', function(){
            AuthDialogManager.open(options);
            expect(AuthDialogManager.isOpened()).toBeTruthy();
        });
    });

    describe('close()', function(){
        beforeEach(function(){
            AuthDialogManager.open({});
        });

        it('should delegate close() to $modal', function(){
            AuthDialogManager.close();
            expect(mockedDialog.close).toHaveBeenCalled();
        });

        it('should convey the state of <<closed>>', function(){
            AuthDialogManager.close();
            expect(AuthDialogManager.isOpened()).toBeFalsy();
        });
    });

    describe('show custom dialog', function(){
        it('showResetPassword should open modal', function(){
            AuthDialogManager.showResetPassword();
            expect(mockedModal.open).wasCalled();
        });

        it('showCheckEmail should open modal', function(){
            AuthDialogManager.showCheckEmail();
            expect(mockedModal.open).wasCalled();
        });

        it('showChangePassword should open modal', function(){
            AuthDialogManager.showChangePassword();
            expect(mockedModal.open).wasCalled();
        });

        it('showPasswordChanged should open modal', function(){
            AuthDialogManager.showPasswordChanged();
            expect(mockedModal.open).wasCalled();
        });
    })

});