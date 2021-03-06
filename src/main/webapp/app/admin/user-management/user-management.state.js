(function () {
	'use strict';

	angular
		.module('acmeApp')
		.config(stateConfig);

	stateConfig.$inject = ['$stateProvider'];

	function stateConfig($stateProvider) {
		$stateProvider
			.state('user-management', {
				parent: 'admin',
				url: '/user-management?page&sort',
				data: {
					roles: ['ADMIN'],
					pageTitle: 'Users'
				},
				views: {
					'content@': {
						templateUrl: 'app/admin/user-management/user-management.html',
						controller: 'UserManagementController',
						controllerAs: 'vm'
					}
				}, params: {
					page: {
						value: '1',
						squash: true
					},
					sort: {
						value: 'id,asc',
						squash: true
					}
				},
				resolve: {
					pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
							return {
								page: PaginationUtil.parsePage($stateParams.page),
								sort: $stateParams.sort,
								predicate: PaginationUtil.parsePredicate($stateParams.sort),
								ascending: PaginationUtil.parseAscending($stateParams.sort)
							};
						}]
				}})
			.state('user-management-detail', {
				parent: 'admin',
				url: '/user/:login',
				data: {
					roles: ['ADMIN'],
					pageTitle: 'acme'
				},
				views: {
					'content@': {
						templateUrl: 'app/admin/user-management/user-management-detail.html',
						controller: 'UserManagementDetailController',
						controllerAs: 'vm'
					}
				}
			})
			.state('user-management.new', {
				parent: 'user-management',
				url: '/new',
				data: {
					roles: ['ADMIN']
				},
				onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
						$uibModal.open({
							templateUrl: 'app/admin/user-management/user-management-dialog.html',
							controller: 'UserManagementDialogController',
							controllerAs: 'vm',
							backdrop: 'static',
							size: 'lg',
							resolve: {
								entity: function () {
									return {
										id: null, login: null, firstName: null, lastName: null, email: null,
										activated: true, langKey: null, createdBy: null, createdDate: null,
										lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
										resetKey: null, roles: null
									};
								}
							}
						}).result.then(function () {
							$state.go('user-management', null, {reload: true});
						}, function () {
							$state.go('user-management');
						});
					}]
			})
			.state('user-management.edit', {
				parent: 'user-management',
				url: '/{login}/edit',
				data: {
					roles: ['ADMIN']
				},
				onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
						$uibModal.open({
							templateUrl: 'app/admin/user-management/user-management-dialog.html',
							controller: 'UserManagementDialogController',
							controllerAs: 'vm',
							backdrop: 'static',
							size: 'lg',
							resolve: {
								entity: ['User', function (User) {
										return User.get({login: $stateParams.login});
									}]
							}
						}).result.then(function () {
							$state.go('user-management', null, {reload: true});
						}, function () {
							$state.go('^');
						});
					}]
			})
			.state('user-management.delete', {
				parent: 'user-management',
				url: '/{login}/delete',
				data: {
					roles: ['ADMIN']
				},
				onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
						$uibModal.open({
							templateUrl: 'app/admin/user-management/user-management-delete-dialog.html',
							controller: 'UserManagementDeleteController',
							controllerAs: 'vm',
							size: 'md',
							resolve: {
								entity: ['User', function (User) {
										return User.get({login: $stateParams.login});
									}]
							}
						}).result.then(function () {
							$state.go('user-management', null, {reload: true});
						}, function () {
							$state.go('^');
						});
					}]
			});
	}
})();
