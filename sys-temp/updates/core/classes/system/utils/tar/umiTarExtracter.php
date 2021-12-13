<?php
 class umiTarExtracter {const TAR_CHUNK_SIZE = 512;const TAR_ENTRY_REGULARFILE = '0';const TAR_ENTRY_HARDLINK = '1';const TAR_ENTRY_SYMLINK = '2';const TAR_ENTRY_CHARDEVICE = '3';const TAR_ENTRY_BLOCKDEVICE = '4';const TAR_ENTRY_DIRECTORY = '5';const TAR_ENTRY_FIFO = '6';const TAR_ENTRY_RESERVED = '7';private $archiveFilename;private $handle;public function __construct($v435ed7e9f07f740abf511a62c00eef6e) {$this->archiveFilename = $v435ed7e9f07f740abf511a62c00eef6e;if (!is_file($this->archiveFilename)) {throw new Exception("umiTarExtracter: {$this->archiveFilename} is not exist");}}public function __destruct() {$this->close();}public function extractFiles($v7a86c157ee9713c34fbd7a1ee40f0c5a = false, $vaa9f73eea60a006820d0f8768bc8a3fc = false) {$v27e06cd2e2c6ab6e2cf7abb4f0db0a37 = 0;$this->open();fseek($this->handle, 0);while ($v27e06cd2e2c6ab6e2cf7abb4f0db0a37 < $v7a86c157ee9713c34fbd7a1ee40f0c5a) {$v8d777f385d3dfec8815d20f7496026dc = fread($this->handle, umiTarExtracter::TAR_CHUNK_SIZE);if ($this->eof($v8d777f385d3dfec8815d20f7496026dc)) {return $v27e06cd2e2c6ab6e2cf7abb4f0db0a37;}$v099fb995346f31c749f6e40db0f395e3 = $this->parseEntryHeader($v8d777f385d3dfec8815d20f7496026dc);if ($v099fb995346f31c749f6e40db0f395e3['typeflag'] == umiTarExtracter::TAR_ENTRY_REGULARFILE) {$v6cd7ba40b435f91219de4fb36548b023 = floor($v099fb995346f31c749f6e40db0f395e3['size'] / umiTarExtracter::TAR_CHUNK_SIZE) + 1;fseek($this->handle, $v6cd7ba40b435f91219de4fb36548b023 * umiTarExtracter::TAR_CHUNK_SIZE, SEEK_CUR);}$v27e06cd2e2c6ab6e2cf7abb4f0db0a37++;}while ($vaa9f73eea60a006820d0f8768bc8a3fc === false || ($v27e06cd2e2c6ab6e2cf7abb4f0db0a37 < $v7a86c157ee9713c34fbd7a1ee40f0c5a + $vaa9f73eea60a006820d0f8768bc8a3fc)) {$v8d777f385d3dfec8815d20f7496026dc = fread($this->handle, umiTarExtracter::TAR_CHUNK_SIZE);if ($this->eof($v8d777f385d3dfec8815d20f7496026dc)) {break;}$v099fb995346f31c749f6e40db0f395e3 = $this->parseEntryHeader($v8d777f385d3dfec8815d20f7496026dc);$vb068931cc450442b63f5b3d276ea4297 = (mb_strlen($v099fb995346f31c749f6e40db0f395e3['prefix']) ? ($v099fb995346f31c749f6e40db0f395e3['prefix'] . '/') : '') . $v099fb995346f31c749f6e40db0f395e3['name'];switch ($v099fb995346f31c749f6e40db0f395e3['typeflag']) {case umiTarExtracter::TAR_ENTRY_REGULARFILE : {$v3d4f47f9d78852ddc35ad26a0c42ba31 = fopen($vb068931cc450442b63f5b3d276ea4297, 'wb');if (!$v3d4f47f9d78852ddc35ad26a0c42ba31) {throw new Exception("umiTarExtracter: can't create file {$vb068931cc450442b63f5b3d276ea4297}");}$v1ad7a99257f9c95f501a2ea541af3e83 = $v099fb995346f31c749f6e40db0f395e3['size'];if ($v1ad7a99257f9c95f501a2ea541af3e83) {do {$vea5273f98c146546ece478f217cf01c7 = ($v1ad7a99257f9c95f501a2ea541af3e83 < umiTarExtracter::TAR_CHUNK_SIZE)         ? $v1ad7a99257f9c95f501a2ea541af3e83         : umiTarExtracter::TAR_CHUNK_SIZE;$v4b3a6218bb3e3a7303e8a171a60fcf92 = fread($this->handle, umiTarExtracter::TAR_CHUNK_SIZE);fwrite($v3d4f47f9d78852ddc35ad26a0c42ba31, $v4b3a6218bb3e3a7303e8a171a60fcf92, $vea5273f98c146546ece478f217cf01c7);$v1ad7a99257f9c95f501a2ea541af3e83 -= umiTarExtracter::TAR_CHUNK_SIZE;}while ($v1ad7a99257f9c95f501a2ea541af3e83 > 0);}fclose($v3d4f47f9d78852ddc35ad26a0c42ba31);break;}case umiTarExtracter::TAR_ENTRY_DIRECTORY : {if (!is_dir($vb068931cc450442b63f5b3d276ea4297) && !mkdir($vb068931cc450442b63f5b3d276ea4297, 0777, true)) {throw new Exception("umiTarExtracter: can't create directory {$vb068931cc450442b63f5b3d276ea4297}");}break;}}$v27e06cd2e2c6ab6e2cf7abb4f0db0a37++;}return $v27e06cd2e2c6ab6e2cf7abb4f0db0a37;}private function open() {if ($this->handle == null) {$this->handle = fopen($this->archiveFilename, 'rb');if ($this->handle === false) {throw new Exception("umiTarExtracter: Can't open {$this->archiveFilename}");}}return $this->handle;}private function close() {if ($this->handle != null) {fclose($this->handle);}}private function parseEntryHeader($v86439efb5a718d47685e2bffc6c6bc2e) {$v099fb995346f31c749f6e40db0f395e3 = unpack(    'a100name/a8mode/a8uid/a8gid/a12size/a12mtime/a8checksum/atypeflag/a100linkname/a6magic/a2version/a32uname/a32gname/a8devmajor/a8devminor/a155prefix/x12pad',    $v86439efb5a718d47685e2bffc6c6bc2e   );$v099fb995346f31c749f6e40db0f395e3['uid'] = octdec($v099fb995346f31c749f6e40db0f395e3['uid']);$v099fb995346f31c749f6e40db0f395e3['gid'] = octdec($v099fb995346f31c749f6e40db0f395e3['gid']);$v099fb995346f31c749f6e40db0f395e3['size'] = octdec($v099fb995346f31c749f6e40db0f395e3['size']);$v099fb995346f31c749f6e40db0f395e3['mtime'] = octdec($v099fb995346f31c749f6e40db0f395e3['mtime']);$v099fb995346f31c749f6e40db0f395e3['checksum'] = octdec(mb_substr($v099fb995346f31c749f6e40db0f395e3['checksum'], 0, 6));return $v099fb995346f31c749f6e40db0f395e3;}private function eof(&$v8d777f385d3dfec8815d20f7496026dc) {$vc4e61fa240610a944fda0d75e4be2343 = null;if ($vc4e61fa240610a944fda0d75e4be2343 == null) {$vc4e61fa240610a944fda0d75e4be2343 = str_repeat(chr(0), 512);}if (strcmp($v8d777f385d3dfec8815d20f7496026dc, $vc4e61fa240610a944fda0d75e4be2343) == 0) {$v8e69d7d49231cedc9a1273af9ac01da7 = fread($this->handle, umiTarExtracter::TAR_CHUNK_SIZE);if (strcmp($v8e69d7d49231cedc9a1273af9ac01da7, $vc4e61fa240610a944fda0d75e4be2343) == 0) {return true;}fseek($this->handle, -umiTarExtracter::TAR_CHUNK_SIZE, SEEK_CUR);}return false;}}