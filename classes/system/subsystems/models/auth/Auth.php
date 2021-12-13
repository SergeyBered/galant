<?php
 namespace UmiCms\System\Auth;use UmiCms\System\Permissions\iSystemUsersPermissions;class Auth implements iAuth {private $authentication;private $authorization;private $systemUserPermissions;private $umiObjects;public function __construct(   iAuthentication $v6fa691d2c07bea6ae78b7022c80e9d20,   iAuthorization $v8f554894c71f78264ea2fbfbff7c80f4,   iSystemUsersPermissions $v1876714ec08549d69462e2d7617c83c8,   \iUmiObjectsCollection $vcf18563b2faa9f3635cd5ad27a53fa1e  ) {$this->authentication = $v6fa691d2c07bea6ae78b7022c80e9d20;$this->authorization = $v8f554894c71f78264ea2fbfbff7c80f4;$this->systemUserPermissions = $v1876714ec08549d69462e2d7617c83c8;$this->umiObjects = $vcf18563b2faa9f3635cd5ad27a53fa1e;}public function checkLogin($vd56b699830e77ba53855679cb1d252da, $v5f4dcc3b5aa765d61d8327deb882cf99) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticate($vd56b699830e77ba53855679cb1d252da, $v5f4dcc3b5aa765d61d8327deb882cf99);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}return $v8e44f0089b076e18a718eb9ca3d94674;}public function checkCode($vc13367945d5d4c91047b3b50234aa7ab) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByCode($vc13367945d5d4c91047b3b50234aa7ab);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}return $v8e44f0089b076e18a718eb9ca3d94674;}public function login($vd56b699830e77ba53855679cb1d252da, $v5f4dcc3b5aa765d61d8327deb882cf99) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticate($vd56b699830e77ba53855679cb1d252da, $v5f4dcc3b5aa765d61d8327deb882cf99);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginUsingId($v8e44f0089b076e18a718eb9ca3d94674) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByUserId($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginOnce($v8e44f0089b076e18a718eb9ca3d94674) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByUserId($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorizeStateless($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginUsingCode($vc13367945d5d4c91047b3b50234aa7ab) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByCode($vc13367945d5d4c91047b3b50234aa7ab);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginBySocials($v9871d3a2c554b27151cacf1422eec048, $v9e9f3d70bd8c8957627eada96d967706, $vaaabf0d39951f3e6c3e8a7911df524c2 = null) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateBySocials($v9871d3a2c554b27151cacf1422eec048, $v9e9f3d70bd8c8957627eada96d967706, $vaaabf0d39951f3e6c3e8a7911df524c2);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginAsFakeUser($v8e44f0089b076e18a718eb9ca3d94674) {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateFakeUser($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorizeFakeUser($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginUsingPreviousUserId() {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByPreviousUserId();}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {return false;}try {$this->getAuthorization()     ->authorizeUsingPreviousUserId($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function isLoginAsGuest() {return $this->getUserId() == $this->getSystemUsersPermissions()     ->getGuestUserId();}public function isLoginAsSv() {$v2ac31cf1165b4a91d74f3ac86c9b136a = $this->getSystemUsersPermissions();$v8e44f0089b076e18a718eb9ca3d94674 = $this->getUserId();if ($v8e44f0089b076e18a718eb9ca3d94674 == $v2ac31cf1165b4a91d74f3ac86c9b136a->getSvUserId()) {return true;}$vee11cbb19052e40b07aac0ca060c23ee = $this->umiObjects->getObject($v8e44f0089b076e18a718eb9ca3d94674);if (!$vee11cbb19052e40b07aac0ca060c23ee instanceof \iUmiObject || $vee11cbb19052e40b07aac0ca060c23ee->getTypeGUID() !== 'users-user') {return false;}return in_array($v2ac31cf1165b4a91d74f3ac86c9b136a->getSvGroupId(), (array) $vee11cbb19052e40b07aac0ca060c23ee->getValue('groups'));}public function isAuthorized() {return !$this->isLoginAsGuest();}public function loginAsGuest() {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getSystemUsersPermissions()    ->getGuestUserId();try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function loginAsSv() {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getSystemUsersPermissions()    ->getSvUserId();try {$this->getAuthorization()     ->authorize($v8e44f0089b076e18a718eb9ca3d94674);}catch (AuthorizationException $ve1671797c52e15f763380b45e841ec32) {return false;}return true;}public function getUserId() {$v3fce094f6bb33e821c58a8c0a56f56bc = $this->getAuthorization()    ->getAuthorizedUserId();if ($v3fce094f6bb33e821c58a8c0a56f56bc !== null) {return (int) $v3fce094f6bb33e821c58a8c0a56f56bc;}return $this->getSystemUsersPermissions()    ->getGuestUserId();}public function logout() {$this->getAuthorization()    ->deAuthorize();return $this->loginAsGuestOnce();}public function logoutOnce() {$this->getAuthorization()    ->deAuthorizeStateless();return $this->loginAsGuestOnce();}public function loginByEnvironment() {$v8f554894c71f78264ea2fbfbff7c80f4 = $this->getAuthorization();$v8e44f0089b076e18a718eb9ca3d94674 = $this->authenticateByHttpAuth();if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {$v8f554894c71f78264ea2fbfbff7c80f4->authorizeUsingFixedSessionId($v8e44f0089b076e18a718eb9ca3d94674);return;}if (defined('PRE_AUTH_ENABLED') && PRE_AUTH_ENABLED) {$v8e44f0089b076e18a718eb9ca3d94674 = $this->authenticateByRequest();if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {$v8f554894c71f78264ea2fbfbff7c80f4->authorize($v8e44f0089b076e18a718eb9ca3d94674);return;}}$v8e44f0089b076e18a718eb9ca3d94674 = $this->authenticateBySession();if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {$v8f554894c71f78264ea2fbfbff7c80f4->authorizeStateless($v8e44f0089b076e18a718eb9ca3d94674);return;}$v8e44f0089b076e18a718eb9ca3d94674 = $this->authenticateByLoginAndToken();if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {$v8f554894c71f78264ea2fbfbff7c80f4->authorize($v8e44f0089b076e18a718eb9ca3d94674);return;}$v92ad7554e2e0d208f33729db6d54b59b = $this->getSystemUsersPermissions()    ->getGuestUserId();$v8f554894c71f78264ea2fbfbff7c80f4->authorizeStateless($v92ad7554e2e0d208f33729db6d54b59b);}private function loginAsGuestOnce() {$v92ad7554e2e0d208f33729db6d54b59b = $this->getSystemUsersPermissions()    ->getGuestUserId();return $this->loginOnce($v92ad7554e2e0d208f33729db6d54b59b);}private function authenticateByHttpAuth() {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByHttpBasic();}catch (WrongCredentialsException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {return $v8e44f0089b076e18a718eb9ca3d94674;}try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByUmiHttpBasic();}catch (WrongCredentialsException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}return $v8e44f0089b076e18a718eb9ca3d94674;}private function authenticateByRequest() {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByRequestParams();}catch (WrongCredentialsException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}if ($v8e44f0089b076e18a718eb9ca3d94674 !== false) {return $v8e44f0089b076e18a718eb9ca3d94674;}try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByHeaders();}catch (WrongCredentialsException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}return $v8e44f0089b076e18a718eb9ca3d94674;}private function authenticateBySession() {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateBySession();}catch (AuthenticationException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}return $v8e44f0089b076e18a718eb9ca3d94674;}private function authenticateByLoginAndToken() {try {$v8e44f0089b076e18a718eb9ca3d94674 = $this->getAuthentication()     ->authenticateByLoginAndToken();}catch (WrongCredentialsException $ve1671797c52e15f763380b45e841ec32) {$v8e44f0089b076e18a718eb9ca3d94674 = false;}return $v8e44f0089b076e18a718eb9ca3d94674;}private function getAuthentication() {return $this->authentication;}private function getAuthorization() {return $this->authorization;}private function getSystemUsersPermissions() {return $this->systemUserPermissions;}}