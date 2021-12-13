<?php
 interface iPermissionsCollection {public function getOwnerType($vb0ab4f7791b60b1e8ea01057b77873b0);public function makeSqlWhere($vb0ab4f7791b60b1e8ea01057b77873b0, $v8a7ee68c0472cf0cf8e3f2cba2134c27 = false);public function isAllowedModule($vb0ab4f7791b60b1e8ea01057b77873b0, $v22884db148f0ffb0d830ba431102b0b5);public function isAllowedMethod($vb0ab4f7791b60b1e8ea01057b77873b0, $v22884db148f0ffb0d830ba431102b0b5, $vea9f6aca279138c58f705c8d4cb4b8ce, $v8a7ee68c0472cf0cf8e3f2cba2134c27 = false);public function isAllowedObject($vb0ab4f7791b60b1e8ea01057b77873b0, $v16b2b26000987faccb260b9d39df1269, $vbd354405a20aa635025421c9edb5d41d = false);public function isAllowedEditInPlace();public function isAllowedDomain($vb0ab4f7791b60b1e8ea01057b77873b0, $v72ee76c5c29383b7c9f9225c1fa4d10b);public function setAllowedDomain($vb0ab4f7791b60b1e8ea01057b77873b0, $v72ee76c5c29383b7c9f9225c1fa4d10b, $vb394126a0e52e75f1e3d535d0fb0d33c = 1);public function isPageCanBeViewed($vb0ab4f7791b60b1e8ea01057b77873b0, $va6eb4816205178e88dad66a16a19ff45);public function isSv($v8e44f0089b076e18a718eb9ca3d94674 = false);public function isAdmin($v8e44f0089b076e18a718eb9ca3d94674 = false, $vece42746c2b3aa1e585809fa739602ae = false);public function isOwnerOfObject($v16b2b26000987faccb260b9d39df1269, $v8e44f0089b076e18a718eb9ca3d94674 = false);public function setDefaultPermissions($v7552cd149af7495ee7d8225974e50f80);public function setInheritedPermissions($v7552cd149af7495ee7d8225974e50f80);public function resetElementPermissions($v7552cd149af7495ee7d8225974e50f80, $vb0ab4f7791b60b1e8ea01057b77873b0 = false);public function deleteElementsPermissionsByOwnerId($vb0ab4f7791b60b1e8ea01057b77873b0);public function resetModulesPermissions($vb0ab4f7791b60b1e8ea01057b77873b0, $v0eb9b3af2e4a00837a1b1a854c9ea18c = null);public function setElementPermissions($vb0ab4f7791b60b1e8ea01057b77873b0, $v7552cd149af7495ee7d8225974e50f80, $vc9e9a848920877e76685b2e4e76de38d);public function setModulesPermissions(   $vb0ab4f7791b60b1e8ea01057b77873b0,   $v22884db148f0ffb0d830ba431102b0b5,   $vea9f6aca279138c58f705c8d4cb4b8ce = false,   $v75a2a330879d5ddd5512ff17851f0061 = true  );public function deleteModulePermission($vb0ab4f7791b60b1e8ea01057b77873b0, $v22884db148f0ffb0d830ba431102b0b5);public function deleteMethodPermission($vb0ab4f7791b60b1e8ea01057b77873b0, $v22884db148f0ffb0d830ba431102b0b5, $vea9f6aca279138c58f705c8d4cb4b8ce);public function setMethodPermissions($vb0ab4f7791b60b1e8ea01057b77873b0, $v22884db148f0ffb0d830ba431102b0b5, $vea9f6aca279138c58f705c8d4cb4b8ce, $v75a2a330879d5ddd5512ff17851f0061 = true);public function hasUserPermissions($vb0ab4f7791b60b1e8ea01057b77873b0);public function hasUserModulesPermissions($vb0ab4f7791b60b1e8ea01057b77873b0);public function copyHierarchyPermissions($v1fa96cda79d6a13e7abbc85448084fcf, $v3504006854d4e51b5c97e94f19baba29);public function getStaticPermissions($v22884db148f0ffb0d830ba431102b0b5, $veb6d5456d31908ef274c16f730151af3 = false);public function isAllowedAdminEntryPoint(int $v8e44f0089b076e18a718eb9ca3d94674, string $v22884db148f0ffb0d830ba431102b0b5, string $vea9f6aca279138c58f705c8d4cb4b8ce) : bool;public function getFirstAllowedAdminEntryPoint(int $v8e44f0089b076e18a718eb9ca3d94674, string $v22884db148f0ffb0d830ba431102b0b5 = null) : array;public function hasAllowedAdminEntryPoints(int $v8e44f0089b076e18a718eb9ca3d94674) : bool;public function cleanupBasePermissions();public function setDefaultElementPermissions(iUmiHierarchyElement $v8e2dcfd7e7e24b1ca76c1193f645902b, $vb0ab4f7791b60b1e8ea01057b77873b0);public function setAllElementsDefaultPermissions($vb0ab4f7791b60b1e8ea01057b77873b0);public function getUsersByElementPermissions($v7552cd149af7495ee7d8225974e50f80, $vc9e9a848920877e76685b2e4e76de38d = 1);public function getRecordedPermissions($v7552cd149af7495ee7d8225974e50f80);public function getPrivileged($v58f57b98cc8cfb81907179e9b4635762);public function clearCache();}