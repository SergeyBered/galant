<?php
 return [  'package' => 'Packer',  'destination' => './sys-temp/packer/out/',  'directories' => [   './sys-temp/packer/config/'  ],  'files' => [   './sys-temp/packer/config/config.sample.php',  ],  'registry' => [   'blogs20' => [    'path' => 'modules/blogs20',    'recursive' => true   ]  ],  'types' => [   8  ],  'fieldTypes' => [   20  ],  'objects' => [   4  ],  'branchesStructure' => [   3  ],  'langs' => [   1  ],  'templates' => [   1  ],  'savedRelations' => [   'fields_relations',   'files',   'hierarchy',   'permissions',   'guides'  ] ];