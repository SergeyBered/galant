<?php
 namespace UmiCms\Classes\System\Exception\Handler;use UmiCms\System\Response\iFacade as iResponseFacade;class System extends Base {const ERROR_MESSAGE = <<<ERROR
Произошла критическая ошибка. Скорее всего, потребуется участие разработчиков.  
Подробности по ссылке <a title="" target="_blank" href="https://errors.umi-cms.ru/17000/">17000</a>
ERROR;