<?php
 namespace UmiCms\System\Events\Executor;use \iCmsController as iModuleLoader;use UmiCms\System\Events\iExecutor;interface iModule extends iExecutor {const SERVICE_NAME = 'ModuleEventHandlerExecutor';public function setModuleLoader(iModuleLoader $ve73640dc910137b64969c6b9234502ea) : iModule;}