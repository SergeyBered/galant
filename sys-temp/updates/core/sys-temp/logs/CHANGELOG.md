### Ядро


#### Добавлено
- Добавлена поддержка версий php до 7.4.10 включительно ([#4696](https://github.com/Umisoft/umi.cms.2/pull/4696))
- Добавлена поддержка Apache 2.4 ([#4836](https://github.com/Umisoft/umi.cms.2/pull/4836))
- Добавлена проверка наличия php библиотек xml, dom и openssl в рамках проверки системных требований ([#4718](https://github.com/Umisoft/umi.cms.2/pull/4718/))
- Добавлен новый модуль "Push уведомления" ([#4429](https://github.com/Umisoft/umi.cms.2/pull/4429))
- Добавлен пакет "guzzlehttp/guzzle" ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Добавлен вывод заголовков ответа в лог запросов http клиентов ([#4341](https://github.com/Umisoft/umi.cms.2/pull/4341/))
- Добавлен класс для упрощения работы с http запросами Service::LiteHttpClientFactory() ([#4419](https://github.com/Umisoft/umi.cms.2/pull/4419))
- Добавлена возможность указывать свой заголовок "X-Mailer" при отправке почты через config.ini [mail] x-mailer ([#4420](https://github.com/Umisoft/umi.cms.2/pull/4420))
- Добавлена возможность задавать файл с правилами инициализации сервисов (services.php) для шаблона (в директории /templates/<имя-шаблона>/) ([#4434](https://github.com/Umisoft/umi.cms.2/pull/4434))
- Добавлена возможность включать редирект с http на https через config.ini [seo] https-redirect ([#4444](https://github.com/Umisoft/umi.cms.2/pull/4444))
- Добавлена поддержка логирования для клиента Яндекс.OAuth ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Добавлена переадресация с адресов с префиксом языка по умолчанию ([#4499](https://github.com/Umisoft/umi.cms.2/pull/4499))
- Добавлен новый тип поля "Ссылка на язык" ([#4509](https://github.com/Umisoft/umi.cms.2/pull/4509))
- Добавлен новый тип поля "Ссылка на список языков" ([#4509](https://github.com/Umisoft/umi.cms.2/pull/4509))
- Добавлена возможность указывать для обработчика события произвольный класс ([#4517](https://github.com/Umisoft/umi.cms.2/pull/4517))
- Добавлен метод SelectorFactory::createPageTypeId() ([#4550](https://github.com/Umisoft/umi.cms.2/pull/4550))
- Добавлена поддержка сортировки по глобальному положению страницы в дереве через Selector (global_ord) ([#4550](https://github.com/Umisoft/umi.cms.2/pull/4550))
- Добавлена возможность исключать из роутинга страницы заданного базового типа ([#4502](https://github.com/Umisoft/umi.cms.2/pull/4502))
- Добавлена возможность кастомизировать роутинг постраничной навигации ([#4403](https://github.com/Umisoft/umi.cms.2/pull/4403/))
- Добавлены настройки постраничной навигации в config.ini [page-navigation] ([#4403](https://github.com/Umisoft/umi.cms.2/pull/4403/))
- Добавлен класс и фабрика для работы jwt токенами ([#4494](https://github.com/Umisoft/umi.cms.2/pull/4494/))
- Добавлен класс для работы с приватными ключами ([#4494](https://github.com/Umisoft/umi.cms.2/pull/4494/))
- Добавлена интеграция с api Google.OAuth ([#4494](https://github.com/Umisoft/umi.cms.2/pull/4494/))
- Добавлено хранение лога изменений в репозитории проекта ([#4573](https://github.com/Umisoft/umi.cms.2/pull/4573))
- Добавлена возможность указать свой класс для подключения к бд в config.ini [connections] core.connection-class ([#4572](https://github.com/Umisoft/umi.cms.2/pull/4572))
- Добавлен метод umiHierarchy::getAbsolutePath() ([#4435](https://github.com/Umisoft/umi.cms.2/pull/4435/))
- Добавлен метод Request::time() ([#4441](https://github.com/Umisoft/umi.cms.2/pull/4441))
- Добавлен хелпер для php шаблонизатора getObjectByGuid ([#4504](https://github.com/Umisoft/umi.cms.2/pull/4504/))
- Добавлена загрузка файлов events.php из директории /templates/<имя-шаблона>/classes/components/ ([#4505](https://github.com/Umisoft/umi.cms.2/pull/4505))
- Добавлена возможность использовать текущий протокол в адресах, передаваемых в GoOutController  ([#4534](https://github.com/Umisoft/umi.cms.2/pull/4534/))
- Добавлена поддержка autoload для расширений модулей  ([#4575](https://github.com/Umisoft/umi.cms.2/pull/4575/))
- Добавлен метод xmlTranslator::enableTplMacrosParsing() для управления включением парсинга tpl макросов ([#4609](https://github.com/Umisoft/umi.cms.2/pull/4609))
- Добавлен метод xmlTranslator::setMacrosBlackList() для отключение парсинга определеных tpl макросов ([#4609](https://github.com/Umisoft/umi.cms.2/pull/4609))
- Добавлена возможность задать SET запросы в базу данных при инициализации ее подключения через config.ini [connections] core.init.query[]  ([#4642](https://github.com/Umisoft/umi.cms.2/pull/4642))
- Добавлен параметр config.ini [session] cookie-same-site для настройки атрибута SameSite авторизационных кук ([#4682](https://github.com/Umisoft/umi.cms.2/pull/4682))
- Добавлена возможность для событий указывать поддерживаемые обработчики через umiEventPoint::setMethods() ([#4687](https://github.com/Umisoft/umi.cms.2/pull/4687))
- Добавлена возможность для крона указывать поддерживаемые обработчики через umiCron::setMethods() ([#4687](https://github.com/Umisoft/umi.cms.2/pull/4687))
- Добавлена обработка параметра method в контроллер для cron.php ([#4687](https://github.com/Umisoft/umi.cms.2/pull/4687))
- Добавлена обработка параметра method в консольной команде для cron.php ([#4687](https://github.com/Umisoft/umi.cms.2/pull/4687))
- Добавлена автоматическая установка свойства домена 'Использует ssl' при установке системы ([#4720](https://github.com/Umisoft/umi.cms.2/pull/4720))
- Добавлена возможность использовать сортировку по 'global_ord' без указания свойства 'hierarchy' в Selector ([#4754](https://github.com/Umisoft/umi.cms.2/pull/4754))
- Добавлена обработка исключения в случае если версия php не поддерживает функции для работы с форматом изображений webp ([#4790](https://github.com/Umisoft/umi.cms.2/pull/4790))
- Добавлен новый тип поля "Ссылка на тип цены" ([#4804](https://github.com/Umisoft/umi.cms.2/pull/4804))
- Добавлен метод Request::origin() ([#4848](https://github.com/Umisoft/umi.cms.2/pull/4848))
- Добавлена отправка заголовка 'Access-Control-Allow-Origin', если сайт запрошен с зеркала или с другого домена в рамках мультисайтовости ([#4848](https://github.com/Umisoft/umi.cms.2/pull/4848))
- Добавлен метод Service::DomainDetector()->detectMirrorUrl() ([#4851](https://github.com/Umisoft/umi.cms.2/pull/4851))
- Добавлен учет зеркала при выводе адреса страницы с параметрами пагинации в макросе system/numpages ([#4851](https://github.com/Umisoft/umi.cms.2/pull/4851))
- Добавлено сообщение о включенном расширении php "Zend OPcache" в окно установщика системы ([#20](https://github.com/Umisoft/install.umi-cms.ru/pull/20))

#### Изменено
- Абстрактные классы http клиентов переведены на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Класс http клиента Яндекс.OAuth переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Улучшена работа определителя мобильного браузера ([#4443](https://github.com/Umisoft/umi.cms.2/pull/4443))
- Улучшено отображение сообщений о фатальных ошибках и исключения на мобильных устройствах ([#4471](https://github.com/Umisoft/umi.cms.2/pull/4471))
- Актуализован пример конфига для nginx ([#4481](https://github.com/Umisoft/umi.cms.2/pull/4481))
- Проведен рефакторинг работы с обработчиками событий, umiEventListener и iUmiEventListener теперь deprecated ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))
- Оптимизирована выборка получения максимального индекса сортировки объектов одного типа ([#4555](https://github.com/Umisoft/umi.cms.2/pull/4555))
- Оптимизированы выборки заказов по id незарегистрированного покупателя в selector ([#4554](https://github.com/Umisoft/umi.cms.2/pull/4554))
- Внедрен единый метод получения номера страницы в рамках пагинации ([#4394](https://github.com/Umisoft/umi.cms.2/pull/4394))
- Расширен интерфейс ORM по работе с фильтрацией и сортировкой через бд ([#4519](https://github.com/Umisoft/umi.cms.2/pull/4519))
- Отключен вывод трейса от xdebug, если отключен системный debug ([#4621](https://github.com/Umisoft/umi.cms.2/pull/4621))
- Включена запись логов об аварийных завершениях запросов при использовании настройки "handle-shutdown" вместо вывода ошибок в буффер ([#4653](https://github.com/Umisoft/umi.cms.2/pull/4653))
- Фабрика кук для всех кук будет использовать по умолчанию опции их config.ini [session] ([#4682](https://github.com/Umisoft/umi.cms.2/pull/4682))
- Внедрен новый синтаксис для работы с обработчиками событий ([#4684](https://github.com/Umisoft/umi.cms.2/pull/4684))
- Обновлены уязвимые composer пакеты ([#4762](https://github.com/Umisoft/umi.cms.2/pull/4762))
- Исправлена работа системы под apache 2.2 ([#4894](https://github.com/Umisoft/umi.cms.2/pull/4894))

#### Исправлено
- Исправлена обработка страниц с подстрокой json или xml в адресе ([#4339](https://github.com/Umisoft/umi.cms.2/pull/4339))
- Исправлена логика принятия решения о необходимости менять значение в бд для полей типа "Набор изображений" и "Набор файлов" ([#4376](https://github.com/Umisoft/umi.cms.2/pull/4376))
- Исправлена обработка ошибок при запросе системных протоколов ([#4391](https://github.com/Umisoft/umi.cms.2/pull/4391))
- Исправлена опечатка в имени класса "AuthThumb" => "AutoThumb" ([#4412](https://github.com/Umisoft/umi.cms.2/pull/4412/))
- Исправлена работа сопоставления шаблонов запроса в протоколе umap ([#4444](https://github.com/Umisoft/umi.cms.2/pull/4444))
- Исправлена работа формы активации системы ([#4484](https://github.com/Umisoft/umi.cms.2/pull/4484))
- Исправлено кеширование системных xml и json вызовов в примере конфига nginx ([#4491](https://github.com/Umisoft/umi.cms.2/pull/4491))
- Исправлена проверка прав на просмотр страницы ([#4513](https://github.com/Umisoft/umi.cms.2/pull/4513))
- Исправлена работа файла autoload.custom.php в триальной системе ([#633](https://github.com/Umisoft/umi.cms2-builder/pull/633))
- Исправлена работа файла Cron.php в триальной системе ([#633](https://github.com/Umisoft/umi.cms2-builder/pull/633))
- Исправлен путь до директории для хранения сертификатов класса umiOpenSSL ([#4495](https://github.com/Umisoft/umi.cms.2/pull/4495))
- Исправлено определение ip адреса отправителя запросов в классе Request ([#4615](https://github.com/Umisoft/umi.cms.2/pull/4615))
- Исправлены ошибки в логе консольной установки ([#4666](https://github.com/Umisoft/umi.cms.2/pull/4666))
- Исправлена обработка некорректной инициализации контроллеров ([#4682](https://github.com/Umisoft/umi.cms.2/pull/4682))
- Исправлена загрузка обработчиков событий при запуске cron.php ([#4684](https://github.com/Umisoft/umi.cms.2/pull/4684))
- Исправлен переход на http авторизацию в случае исключений в других типах авторизации ([#4704](https://github.com/Umisoft/umi.cms.2/pull/4704))
- Исправлен экспорт подсказок для групп полей в umidump ([#4709](https://github.com/Umisoft/umi.cms.2/pull/4709))
- Исправлен импорт подсказок для групп полей в umidump ([#4710](https://github.com/Umisoft/umi.cms.2/pull/4710))
- Исправлена переадресация на язык домена по умолчанию, если сам язык не имеет значения свойства 'по умолчанию' ([#4756](https://github.com/Umisoft/umi.cms.2/pull/4756))
- Исправлена возможность обхода проверок полей форм обратной связи ([#4757](https://github.com/Umisoft/umi.cms.2/pull/4757))
- Исправлена верстка нижней паненли файлового менеджера ([#4775](https://github.com/Umisoft/umi.cms.2/pull/4775))
- Исправлена установка системы на некоторые хостинги ([#4806](https://github.com/Umisoft/umi.cms.2/pull/4806))
- Исправлена работа функций getTitlePrefix, macros_title, macros_describtion и macros_keywords ([#4872](https://github.com/Umisoft/umi.cms.2/pull/4872))
- Исправлено определение текущего языка при запросах по umi-протоколам ([#5014](https://github.com/Umisoft/umi.cms.2/pull/5014))
- Исправлена генерация plain-text части письма ([#5019](https://github.com/Umisoft/umi.cms.2/pull/5019))

#### Удалено
- Удален пакет "symfony/event-dispatcher" ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Удалено бросание исключений при обновлении из-за отсутствии файла автозагрузки в /templates/ ([#4514](https://github.com/Umisoft/umi.cms.2/pull/4514))


### Административная панель


#### Добавлено
- Добавлен интерфейс для управления полем типа "Набор изображений" в новый табличный контрол ([#4355](https://github.com/Umisoft/umi.cms.2/pull/4355/))
- Добавлен интерфейс для управления полем типа "Набор файлов" в новый табличный контрол ([#4355](https://github.com/Umisoft/umi.cms.2/pull/4355))
- Добавлена возможность сохранять пустые значения в быстром редактировании нового табличного контрола ([#4380](https://github.com/Umisoft/umi.cms.2/pull/4380))
- Добавлена фильтрация полей типов "Набор изображений" и "Набор файлов" в новом табличном контроле ([#4387](https://github.com/Umisoft/umi.cms.2/pull/4387))
- Добавлена обработка исключения об истекшем csrf токене ([#4437](https://github.com/Umisoft/umi.cms.2/pull/4437/))
- Добавлен вывод уведомлений о доступных обновлениях для не супервайзеров ([#4450](https://github.com/Umisoft/umi.cms.2/pull/4450))
- Добавлена проверка на заполненность поля "Название" у объектов в административной панели  ([#4576](https://github.com/Umisoft/umi.cms.2/pull/4576/))
- Добавлен метод TreeItem::active() для получения статуса активности страницы ([#4611](https://github.com/Umisoft/umi.cms.2/pull/4611))
- Добавлена поддержка типов полей symlink, wysiwyg, text, relation и counter в новый табличный контрол ([#4698](https://github.com/Umisoft/umi.cms.2/pull/4698))
- Добавлены переменные domain-url и request-url в xsl шаблонах административной панели ([#4705](https://github.com/Umisoft/umi.cms.2/pull/4705))
- Добавлен параметр disabled для шаблона полей строковых и числовых типов в шаблонах form.modify ([#4705](https://github.com/Umisoft/umi.cms.2/pull/4705))
- Добавлена возможность перегрузить шаблон обертки формы редактирования/создания в шаблонах form.modify ([#4705](https://github.com/Umisoft/umi.cms.2/pull/4705))
- Добавлена возможность перегрузить шаблон формы редактирования/создания в шаблонах form.modify ([#4705](https://github.com/Umisoft/umi.cms.2/pull/4705))
- Добавлен параметр required для шаблона полей строковых и числовых типов в шаблонах form.modify ([#4707](https://github.com/Umisoft/umi.cms.2/pull/4707))
- Добавлен хеш в запрос имени файла спрайта кнопок в css файле ([#4793](https://github.com/Umisoft/umi.cms.2/pull/4793))
- Добавлены кнопки undo и redo в визуальный редактор полей типа HTML-текст ([#4844](https://github.com/Umisoft/umi.cms.2/pull/4844))
- Добавлена отправка имени поля, идетификатора страницы и объекта поля с файлами в файловый менеджер при редактировании его в табличном контроле ([#4910](https://github.com/Umisoft/umi.cms.2/pull/4910))
- Добавлена передача параметра "file_hash" в вызов файлового менеджера ([#4941](https://github.com/Umisoft/umi.cms.2/pull/4941))
- Добавлена возможность сохранять файлы, в названии которых присутствует кириллица, в полях типа "Изображение", "Файл", "Набор изображений" и "Набор файлов" ([#4995](https://github.com/Umisoft/umi.cms.2/pull/4995))

#### Изменено
- Обновлены уязвимые npm пакеты ([#4422](https://github.com/Umisoft/umi.cms.2/pull/4422))
- Улучшено отображение выпадающих списков ([#4549](https://github.com/Umisoft/umi.cms.2/pull/4549))
- Исправлена отрисовка поля типа "Изображение" после сохранения в него пустого значения в новом табличном контроле ([#4380](https://github.com/Umisoft/umi.cms.2/pull/4380))
- Запрещена возможность выбирать неактивные страницы в полях типа "Ссылка на дерево" ([#4611](https://github.com/Umisoft/umi.cms.2/pull/4611))
- Улучшено удобство редактирования изображений в табличном контроле ([#4702](https://github.com/Umisoft/umi.cms.2/pull/4702))
- Обновлены уязвимые npm пакеты ([#4762](https://github.com/Umisoft/umi.cms.2/pull/4762))
- Обновлен блок "Поделиться" ([#4766](https://github.com/Umisoft/umi.cms.2/pull/4766))
- Удалена сторонняя Яндекс.Метрика из блока "Поделиться" ([#4768](https://github.com/Umisoft/umi.cms.2/pull/4768))
- Удалена кнопка "Перейти на страницу" на странице создания страницы ([#4788](https://github.com/Umisoft/umi.cms.2/pull/4788))
- Удалена кнопка "Добавить" на странице создания страницы ([#4826](https://github.com/Umisoft/umi.cms.2/pull/4826))
- Обновлена fancybox до версии 3.5.7 ([#4854](https://github.com/Umisoft/umi.cms.2/pull/4854))
- Кнопка выбора колонок в табличном контроле не отображается в случае когда колонка одна ([#4856](https://github.com/Umisoft/umi.cms.2/pull/4856))
- Правка backbone.marionette v2.4.5 для работы с jQuery v3 ([#4911](https://github.com/Umisoft/umi.cms.2/pull/4911))
- Обновлена jQuery до версии v3.5.1 ([#4926](https://github.com/Umisoft/umi.cms.2/pull/4926))
- При переходе на страницу модуля, на который нет прав, теперь отображается информация вместо формы авторизации ([#5021](https://github.com/Umisoft/umi.cms.2/pull/5021))
- Опция "Использовать настройки сайта" переименована в "Использовать индивидуальные настройки для сайта" ([#5022](https://github.com/Umisoft/umi.cms.2/pull/5022))

#### Исправлено
- Исправлено экранирование полей title и alt в контроле типа "Изображение" ([#4349](https://github.com/Umisoft/umi.cms.2/pull/4349))
- Исправлено появление кнопки "Сохранить и посмотреть" в формах редактирования страниц ([#4370](https://github.com/Umisoft/umi.cms.2/pull/4370))
- Исправлено появление кнопки "Добавить и посмотреть" в формах редактирования страниц ([#4370](https://github.com/Umisoft/umi.cms.2/pull/4370))
- Исправлено изменения порядка значений путем перетаскивания в полях типа "Набор изображений" и "Набор файлов" ([#4376](https://github.com/Umisoft/umi.cms.2/pull/4376))
- Исправлено отображение названия элемента при добавлении в поле типа "Составное" ([#4395](https://github.com/Umisoft/umi.cms.2/pull/4395))
- Исправлен вывод поля "title" в контроле типа "Изображение" ([#4415](https://github.com/Umisoft/umi.cms.2/pull/4415))
- Исправлено отображение полей типа "выпадающий список" в старом табличном контроле ([#4425](https://github.com/Umisoft/umi.cms.2/pull/4425))
- Исправлено отображение метки "Виртуальная копия" в старом табличном контроле ([#4447](https://github.com/Umisoft/umi.cms.2/pull/4447))
- Исправлено отображение поля типа "Выпадающий список со множественным выбором" в формах административной панели ([#4449](https://github.com/Umisoft/umi.cms.2/pull/4449/))
- Исправлено отображение контрола выбора домена при их большом количестве ([#4478](https://github.com/Umisoft/umi.cms.2/pull/4478))
- Исправлено отображение текущего вводимого текста при поиске в поле типа "Выпадающий список" ([#4475](https://github.com/Umisoft/umi.cms.2/pull/4475))
- Исправлено отображение формы авторизации на узких экранах ([#4483](https://github.com/Umisoft/umi.cms.2/pull/4483))
- Исправлено перенаправление после авторизации: теперь перенаправляет на текущую страницу ([#4490](https://github.com/Umisoft/umi.cms.2/pull/4490))
- Исправлено отображение имени файла при его вставке через быстрое редактирование табличного контрола ([#4515](https://github.com/Umisoft/umi.cms.2/pull/4515))
- Исправлено определение текущего домена в поле типа "Ссылка на дерево" ([#4518](https://github.com/Umisoft/umi.cms.2/pull/4518))
- Исправлена возможность менять порядок значений в поле типа "Выпадающий список со множественным выбором" ([#4527](https://github.com/Umisoft/umi.cms.2/pull/4527))
- Исправлена отправка мусорных данных при сохранении значения поля типа "Ссылка на дерево" ([#4565](https://github.com/Umisoft/umi.cms.2/pull/4565))
- Исправлена минификация статических ресурсов админ панели ([#4567](https://github.com/Umisoft/umi.cms.2/pull/4567))
- Исправлена ошибка деления на ноль в кешировании данных постраничной навигации для табличных контролов ([#4439](https://github.com/Umisoft/umi.cms.2/pull/4439))
- Исправлена вставка тега li внутрь тега div через TinyMCE ([#4538](https://github.com/Umisoft/umi.cms.2/pull/4538))
- Исправлена вставка тега div внутрь тега a через TinyMCE ([#4537](https://github.com/Umisoft/umi.cms.2/pull/4537))
- Исправлен выбор текущего выбранного файла в файловом менеджере для полей типов "Набор файлов" и "Набор изображений" ([#4596](https://github.com/Umisoft/umi.cms.2/pull/4596))
- Исправлен выбор текущей директории для нового файла в файловом менеджере для полей типов "Набор файлов" и "Набор изображений" ([#4596](https://github.com/Umisoft/umi.cms.2/pull/4596))
- Исправлена индикация неактивных страниц в дереве для полей типа "Ссылка на дерево" ([#4611](https://github.com/Umisoft/umi.cms.2/pull/4611))
- Исправлен вывод сообщения о некорректном логине или email при восстановлении пароля при входе в административную панель ([#4646](https://github.com/Umisoft/umi.cms.2/pull/4646))
- Исправлено дублирование изображений при выборе файлов изображений в поле множественных изображений ([#4651](https://github.com/Umisoft/umi.cms.2/pull/4651))
- Исправлена сортировка по типам полей изображение и файл в табличном контроле ([#4668](https://github.com/Umisoft/umi.cms.2/pull/4668))
- Исправлено отображение полей набор файлов и изображений в старом табличном контроле ([#4670](https://github.com/Umisoft/umi.cms.2/pull/4670))
- Исправлена верстка текста активации лицензии. ([#4654](https://github.com/Umisoft/umi.cms.2/pull/4654))
- Исправлен выпадающий список выходящий за пределы нового табличного контрола ([#4673](https://github.com/Umisoft/umi.cms.2/pull/4673))
- Исправлена генерация ссылки на страницу для блока "Поделиться" ([#4685](https://github.com/Umisoft/umi.cms.2/pull/4685))
- Исправлена работа с сессией в фоне фронтенда и авторизация в миниокне при окончании сессии ([#4700](https://github.com/Umisoft/umi.cms.2/pull/4700))
- Исправлена верстка в окне создания новой страницы eip ([#4701](https://github.com/Umisoft/umi.cms.2/pull/4701))
- Исправлено отображение первой колонки табличного контрола после его перезагрузки ([#4736](https://github.com/Umisoft/umi.cms.2/pull/4736))
- Исправлена поломка пагинации в табличном контроле при уменьшении количества страниц ([#4767](https://github.com/Umisoft/umi.cms.2/pull/4767))
- Исправлено появление значка вопроса при сохранении пустых полей типа изображение и файл в табличном контроле ([#4769](https://github.com/Umisoft/umi.cms.2/pull/4769))
- Исправлена верстка выпадающего списка "Часовой пояс" в коробке ([#4775](https://github.com/Umisoft/umi.cms.2/pull/4775))
- Исправлена активация кнопки "Добавить" в структуре и табличном контроле, когда добавить новый элемент нельзя ([#4780](https://github.com/Umisoft/umi.cms.2/pull/4780))
- Исправлена верстка границ у Drag&Drop в полях типов "Набор изображений" и "Набор файлов" ([#4784](https://github.com/Umisoft/umi.cms.2/pull/4784))
- Исправлено появление лишнего скролбара при редактировании поля типа "Ссылка на дерево" ([#4786](https://github.com/Umisoft/umi.cms.2/pull/4786))
- Исправлен поиск по названию в дочерних узлах ([#4828](https://github.com/Umisoft/umi.cms.2/pull/4828))
- Исправлена верстка свернутых окон внутри файлового менеджера ([#4883](https://github.com/Umisoft/umi.cms.2/pull/4883))
- Исправлена обработка результата вызова метода getEditLink() в методе core::getEditLinkWrapper() ([#4883](https://github.com/Umisoft/umi.cms.2/pull/4883))
- Исправлено сохранение пустых полей типа "Выпадающий список со множественным выбором" ([#4994](https://github.com/Umisoft/umi.cms.2/pull/4994))
- Исправлена сортировка файлов и изображений в полях "Набор файлов" и "Набор изображений" ([#4996](https://github.com/Umisoft/umi.cms.2/pull/4996))
- Исправлено отображение диалогового окна "Обратиться за помощью" ([#5005](https://github.com/Umisoft/umi.cms.2/pull/5005))
- Исправлено перемещение объектов с одной страницы на другую при наличии пагинации ([#4997](https://github.com/Umisoft/umi.cms.2/pull/4997))
- Исправлено копирование вложенных страниц ([#5010](https://github.com/Umisoft/umi.cms.2/pull/5010))
- Исправлены недочеты в английской локализации ([#5032](https://github.com/Umisoft/umi.cms.2/pull/5032))
- Исправленено отображение результата фильтрации в новом табличном контроле при наличии пагинации ([#5035](https://github.com/Umisoft/umi.cms.2/pull/5035))

#### Удалено
- Удален дублирующийся контрол для работы с правами страницы ([#4381](https://github.com/Umisoft/umi.cms.2/pull/4381))
- Удален хардкод вызова метода saveTradeOfferField() из скрипта контрола инлайн редактора ([#4946](https://github.com/Umisoft/umi.cms.2/pull/4946))


### Eip


#### Добавлено
- Добавлен обновленный дизайн ([#4357](https://github.com/Umisoft/umi.cms.2/pull/4357))
- Добавлена возможность сохранять изображения, в названии которых присутствует кириллица, в полях типа "Изображение" и "Набор изображений" ([#4995](https://github.com/Umisoft/umi.cms.2/pull/4995))

#### Изменено
- Изменен порядок вывода модулей ([#4382](https://github.com/Umisoft/umi.cms.2/pull/4382))

#### Исправлено
- Исправлено отображение кнопок "Сохранить" и "Отменить" во всплывающих окнах ([#4363](https://github.com/Umisoft/umi.cms.2/pull/4363))
- Исправлена работа кнопки "Вставить из файлового менеджера" ([#4362](https://github.com/Umisoft/umi.cms.2/pull/4362))
- Исправлена загрузка изображений макросом uploadfile ([#4368](https://github.com/Umisoft/umi.cms.2/pull/4368))

#### Удалено
- Удален неиспользуемый код по части работы с правами страниц во всплывающих формах eip ([#4381](https://github.com/Umisoft/umi.cms.2/pull/4381))


### Модуль "Слайдеры"


#### Исправлено
- Исправлено редактирование слайдов через eip ([#4436](https://github.com/Umisoft/umi.cms.2/pull/4436))


### Модуль "Seo"


#### Добавлено
- Добавлена поддержка логирования для клиента Яндекс.Вебмастер ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Добавлено событие "formationRobotsRules" для кастомизации вывода robots.txt ([#4367](https://github.com/Umisoft/umi.cms.2/pull/4367))
- Добавлены классы для работы с изображениями карты сайта ([#4413](https://github.com/Umisoft/umi.cms.2/pull/4413/))
- Добавлены функционал для генерации карты изображений сайта  ([#4419](https://github.com/Umisoft/umi.cms.2/pull/4419))
- Добавлена возможность просмотра "Икс" через Яндекс.Вебмастер([#4427](https://github.com/Umisoft/umi.cms.2/pull/4427))

#### Изменено
- Класс http клиента Яндекс.Вебмастер переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Обновлена интеграция с api Яндекс.Вебмастер с 3 на 4 версию ([#4427](https://github.com/Umisoft/umi.cms.2/pull/4427))

#### Исправлено
- Исправлена работа с правами на функционал редактирования robots.txt ([#4432](https://github.com/Umisoft/umi.cms.2/pull/4432))
- Исправлена совместная работа старого и нового механизмов кастомизации robots.txt ([#4507](https://github.com/Umisoft/umi.cms.2/pull/4507))
- Исправлено обновление sitemap-images.xml в случаях, когда в sitemap.xml есть страницы, у которых есть неактивные родительские страницы ([#4998](https://github.com/Umisoft/umi.cms.2/pull/4998))
- Исправлена ошибка, возникающая при открытии статистики сайта в разделе "Яндекс.Вебмастер" ([#5024](https://github.com/Umisoft/umi.cms.2/pull/5024))
- Исправлено отображение списка внешних ссылок в статистике сайта, в разделе "Яндекс.Вебмастер" ([#5024](https://github.com/Umisoft/umi.cms.2/pull/5024))


### Модуль "Статистика"


#### Добавлено
- Добавлена поддержка логирования для клиента Яндекс.Метрика ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))

#### Изменено
- Класс http клиента Яндекс.Метрика переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Модуль отвязан от FlashPlayer, отрисовка диаграмм и таблиц теперь работает на JavaScript ([#4922](https://github.com/Umisoft/umi.cms.2/pull/4922/))

#### Исправлено
- Исправлена ошибка "Namespace prefix umi is not defined" в разделах "Яндекс.Метрики" ([#4935](https://github.com/Umisoft/umi.cms.2/pull/4935/))
- Исправлена работа метода StatAdmin::exitPoints() ([#4936](https://github.com/Umisoft/umi.cms.2/pull/4936/))
- Исправлена работа метода StatAdmin::refererByEntry() ([#4938](https://github.com/Umisoft/umi.cms.2/pull/4938/))


### Модуль "Автообновления"


#### Добавлено
- Добавлена поддержка логирования для клиента сервера обновлений ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Добавлена вкладка "Журнал изменений" ([#4582](https://github.com/Umisoft/umi.cms.2/pull/4582))
- Добавлена кнопка для закрытия диалогового окна в конце обновления ([#4989](https://github.com/Umisoft/umi.cms.2/pull/4989))

#### Изменено
- Класс http клиента сервера обновлений переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Вкладка "Манифесты" вынесена в настройки модуля ([#4582](https://github.com/Umisoft/umi.cms.2/pull/4582))

#### Исправлено
- Исправлены падения административной панели при авариях на сервере обновлений ([#4360](https://github.com/Umisoft/umi.cms.2/pull/4360))
- Исправлено отображение ошибки о демонстрационном режиме ([#4571](https://github.com/Umisoft/umi.cms.2/pull/4571))
- Исправлена установка версии и ревизии при принудительном обновлении на текущую версию при доступной новой версии ([#4759](https://github.com/Umisoft/umi.cms.2/pull/4759))
- Исправлены проблемы с миграциями для бд при обновлении сайтов с версий, ниже 20 ([#663](https://github.com/Umisoft/umi.cms2-builder/pull/663))
- Исправлены проблемы с обновлением до 20 версии на редакции Lite ([#663](https://github.com/Umisoft/umi.cms2-builder/pull/663))
- Исправлено появление php уведомлений из-за невозможности записать лог обработки ошибок ([#4832](https://github.com/Umisoft/umi.cms.2/pull/4832))
- Исправлена ошибка при завершении обновления с 20 версии ([#4880](https://github.com/Umisoft/umi.cms.2/pull/4880))
- Исправлена ошибка при обновлении системы, если в корне отсутствует файл installed ([#4895](https://github.com/Umisoft/umi.cms.2/pull/4895))
- Исправлено сохранение текущих настроек в файл install.ini при обновлении ([#4909](https://github.com/Umisoft/umi.cms.2/pull/4909))
- Исправлена перезапись файла autoload.custom.php при обновлении ([#5029](https://github.com/Umisoft/umi.cms.2/pull/5029))


### Модуль "Маркет"


#### Добавлено
- Добавлена поддержка логирования для клиента юми маркета ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))

#### Изменено
- Класс http клиента юми маркета переведен на поддержку guzzle 6.5.22 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))

#### Исправлено
- Исправлено удаление сломанных модулей ([#4559](https://github.com/Umisoft/umi.cms.2/pull/4559))
- Исправлена обработка падения установки модуля ([#4559](https://github.com/Umisoft/umi.cms.2/pull/4559))
- Исправлено отображение превью шаблонов при установке в модуле "маркет" ([#4656](https://github.com/Umisoft/umi.cms.2/pull/4656))



### Модуль "Онлайн-запись"


#### Добавлено
- Добавлена поддержки каптчи ([#4347](https://github.com/Umisoft/umi.cms.2/pull/4347/))
- Добавлен функционал копирования и виртуального копирования на вкладку "Страницы" ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлены права на метод editOrder ([#4921](https://github.com/Umisoft/umi.cms.2/pull/4921))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлены права на методы addPage, editPage, employeeslistByserviceid ([#4949](https://github.com/Umisoft/umi.cms.2/pull/4949))
- Исправлено получение списка подтвержденных заявок в методе getBookedOrders ([#4978](https://github.com/Umisoft/umi.cms.2/pull/4978))



### Модуль "Пользователи"


#### Добавлено
- Добавлен функционал "Запомнить меня" в авторизации ([#4358](https://github.com/Umisoft/umi.cms.2/pull/4358))
- Добавлена постраничная навигация для отображения списка заказов пользователя в административной панели ([#4461](https://github.com/Umisoft/umi.cms.2/pull/4461/))
- Добавлена возможность авторизоваться под существующим пользователем через соц сети ([#4548](https://github.com/Umisoft/umi.cms.2/pull/4548/))
- Добавлены макросы reactivate, reactivate_do, reactivate_done для повторной активации пользователей ([#4924](https://github.com/Umisoft/umi.cms.2/pull/4924))
- Добавлено перенаправление на первый доступный модуль, если при авторизации в административную панель нет прав на текущий модуль ([#4990](https://github.com/Umisoft/umi.cms.2/pull/4990))

#### Исправлено
- Исправлен интерфейс назначения прав доступа для пользователя или группы на странице ([#4374](https://github.com/Umisoft/umi.cms.2/pull/4374))
- Исправлена возможность авторизоваться через ulogin под чужой учеткой ([#4482](https://github.com/Umisoft/umi.cms.2/pull/4482))
- Исправлена авторизация через Loginza ([#4546](https://github.com/Umisoft/umi.cms.2/pull/4546))
- Исправлен вызов метода UsersMacros::checkCsrf() в макросе UsersMacros::settings_do() ([#4919](https://github.com/Umisoft/umi.cms.2/pull/4919))
- Исправлена подгрузка списка доменов для фильтра табличного контрола ([#4923](https://github.com/Umisoft/umi.cms.2/pull/4923))
- Исправлен быстрый экспорт выделенных пользователей, групп пользователей и авторов публикаций в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Удалено
- Удалена возможность авторизоваваться через провайдеров vkontakte, facebook, twitter, loginza, rambler, myopenid, openid, mailruapi, lastfm в Loginza ([#4546](https://github.com/Umisoft/umi.cms.2/pull/4546))


### Модуль "Интернет-магазин"


#### Добавлено
- Добавлено логирование регистрации и авторизации в ApiShip ([#4369](https://github.com/Umisoft/umi.cms.2/pull/4369))
- Добавлена возможность делать возврат средств для Яндекс.Касса ([#4488](https://github.com/Umisoft/umi.cms.2/pull/4488/))
- Добавлена поддержка двухстадиных платежей для Яндекс.Касса ([#4486](https://github.com/Umisoft/umi.cms.2/pull/4486)))
- Добавлены статусы оплаты заказа "Возврат средств" и "Ожидает подтверждения" ([#4486](https://github.com/Umisoft/umi.cms.2/pull/4486)))
- Добавлена возможность переопредлить метод emarket::getPrice() ([#4498](https://github.com/Umisoft/umi.cms.2/pull/4498))
- Добавлена возможность управлять включением страховых сборов в стоимость доставки ApiShip ([#4552](https://github.com/Umisoft/umi.cms.2/pull/4552))
- Добавлена проверка минимальной и максимальной стоимости заказа для возможности оплаты через PayOnline ([#4588](https://github.com/Umisoft/umi.cms.2/pull/4588))
- Добавлена проверка минимальной стоимости заказа для возможности оплаты через PayAnyWay ([#4599](https://github.com/Umisoft/umi.cms.2/pull/4599))
- Добавлена проверка минимальной стоимости заказа для возможности оплаты через Robokassa ([#4600](https://github.com/Umisoft/umi.cms.2/pull/4600))
- Добавлена передача данных о валюте при оплате через Robokassa ([#4600](https://github.com/Umisoft/umi.cms.2/pull/4600))
- Добавлена проверка кода валюты для возможности оплаты через Robokassa ([#4600](https://github.com/Umisoft/umi.cms.2/pull/4600))
- Добавлено логгирование метода payment::poll() для всех способов оплаты ([#4614](https://github.com/Umisoft/umi.cms.2/pull/4614))
- Добавлена возможность изменить существующий объект адреса доставки во время оформления заказа ([#4632](https://github.com/Umisoft/umi.cms.2/pull/4632))
- Добавлено изменение статуса оплаты на "Отменена" для Paypal, RoboKassa и PayAnyWay, если платеж был некорректным ([#4647](https://github.com/Umisoft/umi.cms.2/pull/4647))
- Добавлено удаление пробелов из начала и конца в строковых полях группы "Параметры" ("settings") в способах оплаты ([#4652](https://github.com/Umisoft/umi.cms.2/pull/4652))
- Добавлена возможность переопределять метод сохранения комментария к заказу при оформлении в 1 шаг ([#4658](https://github.com/Umisoft/umi.cms.2/pull/4658))
- Добавлена возможность добавить адрес доставки для незарегистрированного покупателя до оформления заказа в 1 шаг за счет добавления пятого аргумента $customerRequired в макрос emarket::saveInfo() ([#4671](https://github.com/Umisoft/umi.cms.2/pull/4671))
- Добавлена проверка минимальной стоимости заказа для возможности оплаты через Деньги Online ([#4678](https://github.com/Umisoft/umi.cms.2/pull/4678))
- Добавлена проверка кода валюты для возможности оплаты через Деньги Online ([#4678](https://github.com/Umisoft/umi.cms.2/pull/4678))
- Добавлена возможность передачи данных для печати чека 54-ФЗ для Деньги Online ([#4678](https://github.com/Umisoft/umi.cms.2/pull/4678))
- Добавлена проверка кода валюты для возможности оплаты через PayPal ([#4657](https://github.com/Umisoft/umi.cms.2/pull/4657))
- Добавлена проверка минимальной стоимости заказа для возможности оплаты через PayPal ([#4657](https://github.com/Umisoft/umi.cms.2/pull/4657))
- Добавлены языковые константы для статусов оплаты "Возврат средств", "Не установлен" и "Ожидает подтверждения" для почтового уведомления об изменении заказа ([#4764](https://github.com/Umisoft/umi.cms.2/pull/4764))
- Добавлена обработка сообщений об ошибках в ответе Яндекс.Кассы ([#4778](https://github.com/Umisoft/umi.cms.2/pull/4778))
- Добавлена возможность указать тип цены торгового предложения при формировании наименования заказа ([#4804](https://github.com/Umisoft/umi.cms.2/pull/4804))
- Добавлено правило "По промокоду" для скидок "На заказ" и "На товары каталога" ([#4855](https://github.com/Umisoft/umi.cms.2/pull/4855))
- Добавлен метод order::getStatusList() ([#4878](https://github.com/Umisoft/umi.cms.2/pull/4878))
- Добавлена обработка исключения, которое может быть выброшено во время оформления заказа при недоступном push.umi-cms.ru ([#4915](https://github.com/Umisoft/umi.cms.2/pull/4915))
- Добавлена возможность указывать свои идентификаторы типов доставки для самовывоза в config.ini (emarket.self-delivery.types[]) ([#4906](https://github.com/Umisoft/umi.cms.2/pull/4906))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))
- Класс http клиента PayOnline переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Класс http клиента ApiShip переведен на поддержку guzzle 6.5.2 ([#4340](https://github.com/Umisoft/umi.cms.2/pull/4340/))
- Скидки больше не будут применяться к товарам, если работа со скидками отключена в настройках модуля ([#4397](https://github.com/Umisoft/umi.cms.2/pull/4397))
- Поле "Url удачной оплаты" для PayAnyWay теперь необязательно к заполнению, эти данные можно указать в личном кабинете платежной системы ([#4599](https://github.com/Umisoft/umi.cms.2/pull/4599))
- Метод createGuestCustomer в классе customer сделан публичным ([#4398](https://github.com/Umisoft/umi.cms.2/pull/4598))
- Возвращена константа для ранее удаленного поля заказа "Номер заказа в Яндекс.Маркет" ([#4687](https://github.com/Umisoft/umi.cms.2/pull/4687))
- В стандартный шаблон уведомления "Изменение статуса заказа (клиент)" добавлен вывод информации о статусе заказа и статусе оплаты ([#4764](https://github.com/Umisoft/umi.cms.2/pull/4764))
- Адрес доставки больше не сохраняется в заказ при использовании доставки типа "Самовывоз" в заказе в 1 клик ([#4860](https://github.com/Umisoft/umi.cms.2/pull/4860))
- Адрес доставки больше не сохраняется в заказ при использовании доставки типа "Самовывоз" в поэтапном заказе ([#4864](https://github.com/Umisoft/umi.cms.2/pull/4864))
- Способ оплаты "Яндекс.Касса" перенастроен на работу с "ЮKassa" ([#4900](https://github.com/Umisoft/umi.cms.2/pull/4900))
- Изменен адрес для обращения к api ЮKassa ([#4900](https://github.com/Umisoft/umi.cms.2/pull/4900))
- Макрос createForm теперь возвращает информацию об обязательных полях типа "Незарегистрированный покупатель" для неавторизованных покупателей ([#5004](https://github.com/Umisoft/umi.cms.2/pull/5004))

#### Исправлено
- Исправлено соответствие полей и языковых констант для полей "Предмет расчета" и "Способ расчета" ([1932eff6f71e19adbb544dd8fcc4546ae1823acb](https://github.com/Umisoft/umi.cms.2/commit/1932eff6f71e19adbb544dd8fcc4546ae1823acb))
- Исправлена форма создания способа доставки ApiShip ([#4369](https://github.com/Umisoft/umi.cms.2/pull/4369))
- Исправлено подключение провайдера Boxberry в ApiShip ([#4058](https://github.com/Umisoft/umi.cms.2/pull/4058/))
- Исправлено изменение настроек провайдеров ApiShip ([#4372](https://github.com/Umisoft/umi.cms.2/pull/4372/))
- Исправлен учет скидки на заказ при отправлении заказа в ApiShip ([#4373](https://github.com/Umisoft/umi.cms.2/pull/4373))
- Исправлено сохранение полей "Дата последнего изменения статуса заказа" и "Дата разрешения доставки" при изменении полей заказа, не относящихся к его статусу ([#4378](https://github.com/Umisoft/umi.cms.2/pull/4378))
- Исправлена валидация полей незарегистрированного покупателя при оформлении заказа в 1 клик ([#4383](https://github.com/Umisoft/umi.cms.2/pull/4383))
- Исправлен пересчет цен из одной валюты в другую с учетом номинала ([#4438](https://github.com/Umisoft/umi.cms.2/pull/4438))
- Исправлен расчет текущей скидки в корзине после изменение количества товаров ([#4458](https://github.com/Umisoft/umi.cms.2/pull/4458))
- Исправлен учет текущего домена для полей со способами доставки и оплаты на странице заказа в админ панели ([#4532](https://github.com/Umisoft/umi.cms.2/pull/4532))
- Исправлен учет бонусов и граничных ситуаций скидок на заказ в формировании чеков для Яндекс.Касса ([#4556](https://github.com/Umisoft/umi.cms.2/pull/4556))
- Исправлен учет бонусов и граничных ситуаций скидок на заказ в формировании чеков для PayAnyWay ([#4556](https://github.com/Umisoft/umi.cms.2/pull/4556))
- Исправлен учет бонусов и граничных ситуаций скидок на заказ в формировании чеков для PayOnline ([#4556](https://github.com/Umisoft/umi.cms.2/pull/4556))
- Исправлен учет бонусов и граничных ситуаций скидок на заказ в формировании чеков для Robokassa ([#4556](https://github.com/Umisoft/umi.cms.2/pull/4556))
- Исправлено удаление товарного наименования в заказе ([#4580](https://github.com/Umisoft/umi.cms.2/pull/4580))
- Исправлена очистка корзины и изменение статуса заказа, если заказ не был оплачен ([#4585](https://github.com/Umisoft/umi.cms.2/pull/4585))
- Исправлено сохранение адреса в объект покупателя при оформлении заказа ([#4592](https://github.com/Umisoft/umi.cms.2/pull/4592))
- Исправлено сохранение информации о юридическом лице в объект покупателя при оплате счетом для юридических лиц ([#4601](https://github.com/Umisoft/umi.cms.2/pull/4601))
- Исправлено получение символа "_" вместо статуса заказа, оплаты и доставки для почтовых уведомлений, когда для статуса нет соответствующей языковой константы ([#4764](https://github.com/Umisoft/umi.cms.2/pull/4764))
- Исправлена загрузка табличного контрола с торговыми предложениями при наличии в нем поля типа "Ссылка на дерево" ([#4797](https://github.com/Umisoft/umi.cms.2/pull/4797))
- Исправлена установка промежуточного статуса заказа "оплачивается" для платежей типа "Наличными курьеру", "Счет для юридических лиц" и "Платежная квитанция" ([#4916](https://github.com/Umisoft/umi.cms.2/pull/4916))
- Исправлена отправка лишних сообщний покупателю при оформлении заказа ([#4947](https://github.com/Umisoft/umi.cms.2/pull/4947))
- Исправлена возможность утечки памяти в макросе emarket::formResult() ([#4912](https://github.com/Umisoft/umi.cms.2/pull/4912))
- Исправлено отображение торговых предложений в админ панели в случаях, когда тип ТП не соответствует типу объекта страницы товара ([#4973](https://github.com/Umisoft/umi.cms.2/pull/4973))
- Исправлен быстрый экспорт выделенных заказов, скидок, доставок, способов оплаты, валют и складов в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))

#### Удалено
- Удалены выброс исключения и удаление пользователя при его сохранении в оплате в один шаг ([#4566](https://github.com/Umisoft/umi.cms.2/pull/4566))
- Удалена интеграция с платежной системой RbkMoney ([#4589](https://github.com/Umisoft/umi.cms.2/pull/4589))
- Удалена интеграция с платежной системой КупиВКредит ([#4590](https://github.com/Umisoft/umi.cms.2/pull/4590))
- Удалена интеграция с платежной системой AcquiroPay ([#4679](https://github.com/Umisoft/umi.cms.2/pull/4679))
- Удалена интеграция с платежной системой Яндекс.Касса (старое API) ([#4680](https://github.com/Umisoft/umi.cms.2/pull/4680))
- Удалена проверка обязательных полей типа данных "Незарегистрированный покупатель" в макросах createForm и getOneClickOrder для авторизованных пользователей при покупке в 1 клик ([#5004](https://github.com/Umisoft/umi.cms.2/pull/5004))


### Модуль "Обмен данными"


#### Добавлено
- Добавлено обнуление общего количества товаров на складе, если значение не пришло из 1C ([#4428](https://github.com/Umisoft/umi.cms.2/pull/4428))
- Добавлен функционал просмотра логов импорта ([#4501](https://github.com/Umisoft/umi.cms.2/pull/4501))
- Добавлена поддержка мультисайтовости для настроек модуля ([#4547](https://github.com/Umisoft/umi.cms.2/pull/4547))
- Добавлена импорт ставок НДС каталога из 1С ([#4551](https://github.com/Umisoft/umi.cms.2/pull/4551))
- Добавлен экспорт ставок НДС в выгрузку заказов в 1С ([#4371](https://github.com/Umisoft/umi.cms.2/pull/4371))
- Добавлен импорт нескольких изображений для торговых предложений из 1С ([#4716](https://github.com/Umisoft/umi.cms.2/pull/4716))
- Добавлена возможность перегружать методы класса OneCExchange ([#4847](https://github.com/Umisoft/umi.cms.2/pull/4847))
- Добавлена настройка "Обновлять структуру каталога при импорте" ([#4868](https://github.com/Umisoft/umi.cms.2/pull/4868))
- Добавлен экспорт статусов заказов и способов доставки в 1C:УНФ ([#4878](https://github.com/Umisoft/umi.cms.2/pull/4878))
- Добавлена двухсторонняя синхронизация статусов заказов с 1С:УНФ ([#4878](https://github.com/Umisoft/umi.cms.2/pull/4878))
- Добавлен раздел для редактирования 1С-идентификаторов ([#5026](https://github.com/Umisoft/umi.cms.2/pull/5026))

#### Изменено
- Улучшена информативность сообщения об ошибке уникальности артикула торгового предложения ([#4686](https://github.com/Umisoft/umi.cms.2/pull/4686))

#### Исправлено
- Исправлен импорт значений атрибутов торговых предложений, содержащих специальные символы ([#4377](https://github.com/Umisoft/umi.cms.2/pull/4377))
- Исправлена перезапись торговых предложений, если один и тот же товар несколько раз встречаемся в файле импорта из 1С ([#4492](https://github.com/Umisoft/umi.cms.2/pull/4492))
- Исправлен импорт заказов из 1С с поддержкой zip ([#4536](https://github.com/Umisoft/umi.cms.2/pull/4536))
- Исправлено снятие флага "Выгружать заказ" для всех заказов после выгрузки части заказов ([#4792](https://github.com/Umisoft/umi.cms.2/pull/4792))
- Исправлено дублирование остатков торговых предложений при импорте из 1С ([#4796](https://github.com/Umisoft/umi.cms.2/pull/4796))
- Исправлено снятие флага "Выгружать заказ" со всех заказов если заказы не выгружались на шаге "type=sale&mode=query" ([#4827](https://github.com/Umisoft/umi.cms.2/pull/4827))
- Исправлен экспорт страниц из полей "Ссылка на дерево" при экспорте в формате CSV ([#4827](https://github.com/Umisoft/umi.cms.2/pull/4827))
- Исправлено формирование названия файла лога при наличии недопустимых символов разделителей в его составных частях ([#4892](https://github.com/Umisoft/umi.cms.2/pull/4892))
- Исправлена опечатка в названии методов setСalledFrom и getСalledFrom ([#4896](https://github.com/Umisoft/umi.cms.2/pull/4896))
- Исправлена ошибка, когда группы импортировались в количестве, ограниченном настройкой exchange.splitter.limit, если в файлах импорта не было информации о товарах ([#4999](https://github.com/Umisoft/umi.cms.2/pull/4999))
- Исправлен быстрый экспорт выделенных сценариев экспорта и импорта в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "Конфигурация"


#### Добавлено
- Добавлена поддержка совместной работы статического и браузерного кешей ([#4454](https://github.com/Umisoft/umi.cms.2/pull/4454/))
- Добавлена поддержка статического кеша в пример конфига для nginx ([#4481](https://github.com/Umisoft/umi.cms.2/pull/4481))
- Добавлено предупреждение при попытке внести изменения в поле с доменным ключом ([#5013](https://github.com/Umisoft/umi.cms.2/pull/5013))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))
- Работа с водяными знаками перенесена из модуля "Конфигурация" в модуль "Файловая система" ([#4351](https://github.com/Umisoft/umi.cms.2/pull/4351))

#### Исправлено
- Исправлен редирект с зеркал на основной домен в мультисайтовых системах ([#4426](https://github.com/Umisoft/umi.cms.2/pull/4426))
- Исправлена работа опции url-suffix.add со статическим кешем ([#4342](https://github.com/Umisoft/umi.cms.2/pull/4342))
- Исправлены настройки запрета на кеширование по умолчанию ([#4451](https://github.com/Umisoft/umi.cms.2/pull/4451))
- Исправлено определение домена по умолчанию во вкладке "Домены" ([#4594](https://github.com/Umisoft/umi.cms.2/pull/4594))
- Исправлено отображение значений полей "Префикс для TITLE", "TITLE (по умолчанию)", "Keywords (по умолчанию)" и "Description (по умолчанию)" в настройках домена ([#4872](https://github.com/Umisoft/umi.cms.2/pull/4872))


### Модуль "Шаблоны уведомлений"


#### Добавлено
- Добавлено событие mailTemplatesParse для кастомизации шаблонизации ([#4529](https://github.com/Umisoft/umi.cms.2/pull/4529))
- Добавлена поддержка tpl макросов в шаблонах модуля ([#4610](https://github.com/Umisoft/umi.cms.2/pull/4610))

#### Исправлено
- Исправлен заголовок почтовых уведомлений об изменении заказа клиенту, если заказ модифицировался через административную панель ([#4378](https://github.com/Umisoft/umi.cms.2/pull/4378))


### Модуль "Структура"


#### Добавлено
- Добавлен макрос content::gen403() ([#4513](https://github.com/Umisoft/umi.cms.2/pull/4513))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлена генерация ссылки на другой домен в кнопке "Посмотреть" ([#4416](https://github.com/Umisoft/umi.cms.2/pull/4416))
- Исправлена работа макроса content/sitemap ([#4663](https://github.com/Umisoft/umi.cms.2/pull/4663))


### Модуль "Каталог"


### Добавлено
- Добавлен функционал копирования и виртуального копирования на вкладку "Разделы и товары" ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлена возможность использовать поля типов "Набор изображений" и "Набор файлов" для торговых предложений ([#4355](https://github.com/Umisoft/umi.cms.2/pull/4355))
- Добавлена возможность сохранять пустые значения для полей типа "Дата", "Изображение" и "Файл" торгового предложения ([#4380](https://github.com/Umisoft/umi.cms.2/pull/4380))
- Добавлено сохранение набора полей торговых предложений между товарами одного типа ([#4542](https://github.com/Umisoft/umi.cms.2/pull/4542))
- Добавлена настройка "Отключить автоматическую генерацию артикулов для торговых предложений" ([#4595](https://github.com/Umisoft/umi.cms.2/pull/4595))
- Добавлена настройка "Отключить уникальность артикулов для торговых предложений" ([#4686](https://github.com/Umisoft/umi.cms.2/pull/4686))
- Добавлена настройка "Отключить отображение товаров в каталоге, которых нет на складе" ([#4808](https://github.com/Umisoft/umi.cms.2/pull/4808))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))
- Отключена загрузка всех данных торговых предложений при загрузке ветвей дерева ([#4492](https://github.com/Umisoft/umi.cms.2/pull/4492))

#### Исправлено
- Исправлена ошибка возникающая при выполнении манифестов модуля после установки шаблонов без каталога ([#4770](https://github.com/Umisoft/umi.cms.2/pull/4770))
- Исправлено сохранение у торгового предложения в админ панели пустого поля "Ссылка на дерево" ([#4825](https://github.com/Umisoft/umi.cms.2/pull/4825))
- Исправлена переиндексация фильтров с полями типов "Ссылка на язык", "Ссылка на домен", "Ссылка на список языков", "Ссылка на список доменов" ([#4861](https://github.com/Umisoft/umi.cms.2/pull/4861))
- Исправлена работа фильтра с полями в которых присутствует символ "+" ([#4913](https://github.com/Umisoft/umi.cms.2/pull/4913))

#### Удалено
- Удалено ограничение на количество фильтруемых полей для индекса умных фильтров ([#4721](https://github.com/Umisoft/umi.cms.2/pull/4721))


### Модуль "Поиск"


#### Добавлено 
- Добавлена возможность скрывать поля в выдаче поиска по сайту через config.ini [modules] search.context-fields-blacklist[]  ([#4583](https://github.com/Umisoft/umi.cms.2/pull/4583))
- Добавлена индексация имен страниц для поиска: config.ini [kernel] search-index-names = "1"  ([#4846](https://github.com/Umisoft/umi.cms.2/pull/4846))

#### Исправлено
- Исправлена опечатка в настройках модуля ([#4562](https://github.com/Umisoft/umi.cms.2/pull/4562))


### Модуль "Файловая система"


#### Добавлено 
- Добавлен функционал копирования и виртуального копирования на вкладку "Доступные для скачивания файлы" ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлена передача данных текущего объекта и поля в событие filemanager_options_create ([#4596](https://github.com/Umisoft/umi.cms.2/pull/4596))
- Добавлена поддержка изображений формата webp ([#4342](https://github.com/Umisoft/umi.cms.2/pull/4342))
- Добавлена подсказка в раздел "Водяной знак" ([#4774](https://github.com/Umisoft/umi.cms.2/pull/4774))

#### Изменено
- Работа с водяными знаками перенесена из модуля "Конфигурация" в модуль "Файловая система" ([#4351](https://github.com/Umisoft/umi.cms.2/pull/4351))
- Обновлена подсказка в разделе "Водяной знак" ([#4785](https://github.com/Umisoft/umi.cms.2/pull/4785))
- При редактировании водяного знака по умолчанию используется директория images ([#4785](https://github.com/Umisoft/umi.cms.2/pull/4785))
- При предпросмотре водяного знака его изображение больше не кешируется ([#4789](https://github.com/Umisoft/umi.cms.2/pull/4789))

#### Исправлено
- Исправлена работа настройки "Запоминать последнюю папку" в файловом менеджере ([#4440](https://github.com/Umisoft/umi.cms.2/pull/4440))
- Исправлена работа настроек водяного знака ([bc-2178](http://youtrack.umisoft.ru/issue/bc-2178))
- Исправлено отображение редактора изображений в файловом менеджере ([#4561](https://github.com/Umisoft/umi.cms.2/pull/4561))
- Исправлено открытие директории последней картинки при редактировании водяного знака ([#4785](https://github.com/Umisoft/umi.cms.2/pull/4785))
- Исправлено запоминание последней папки файловым менеджером сразу после переключения соответствующего чекбокса ([#4785](https://github.com/Umisoft/umi.cms.2/pull/4785))
- Исправлено расширение окна файлового менеджера при перемещении в нем внутренних окон ([#4785](https://github.com/Umisoft/umi.cms.2/pull/4785))
- Исправлено открытие последней папки для не заполненных полей ([#4879](https://github.com/Umisoft/umi.cms.2/pull/4879))

#### Удалено
- Удалена зависимость работы файлового менеджера от сторонних облачных хранилищ ([#4557](https://github.com/Umisoft/umi.cms.2/pull/4557))


### Модуль "Шаблоны сайта"


#### Добавлено
- Добавлено отображение идентификатора шаблона в модуль "Шаблоны данных", в раздел "Список шаблонов" ([#4986](https://github.com/Umisoft/umi.cms.2/pull/4986))

#### Исправлено
- Исправлено копирование полей в дочерние типы данных при добавлении поля в родительский тип ([#4721](https://github.com/Umisoft/umi.cms.2/pull/4721))
- Исправлено отображение шаблонов и привязанных к ним страниц в разделе "Привязка страниц" ([#4987](https://github.com/Umisoft/umi.cms.2/pull/4987))
- Исправлено отображение списка шаблонов в окне привязки шаблона для выбранных страниц в разделе "Привязка страниц" ([#4988](https://github.com/Umisoft/umi.cms.2/pull/4988))
- Исправлена работа массовой привязки страниц к шаблону в разделе "Привязка страниц" ([#4988](https://github.com/Umisoft/umi.cms.2/pull/4988))

#### Изменено
- Отключен редактор шаблонов в модуле "Шаблоны сайта" в режиме демоцентра ([#4354](https://github.com/Umisoft/umi.cms.2/pull/4354))
- Улучшена обработка ошибок при работе с бекапами в модуле "Шаблоны сайта" ([#4379](https://github.com/Umisoft/umi.cms.2/pull/4379))


### Модуль "Конструктор форм"


#### Исправлено
- Исправлен формат ответа бекенда при валидации заполнения обязательных полей модуля ([#4375](https://github.com/Umisoft/umi.cms.2/pull/4375))
- Исправлен быстрый экспорт выделенных адресов, шаблонов писем и сообщений в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "Резервирование"


#### Исправлено
- Исправлена обработка ошибок при работе с бекапами ([#4379](https://github.com/Umisoft/umi.cms.2/pull/4379))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))


### Модуль "Комментарии"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлен функционал добавления вложенных комментариев через административную панель ([#4771](https://github.com/Umisoft/umi.cms.2/pull/4771))

#### Исправлено
- Исправлена обработка ошибок при создании комментариев от незарегистрированного пользователя ([#4396](https://github.com/Umisoft/umi.cms.2/pull/4396))
- Исправлено отображение вложенных комментариев в разделе "Список комментариев" ([#4545](https://github.com/Umisoft/umi.cms.2/pull/4545))
- Исправлено отображение вложенных комментариев в разделе "Неактивные комментарии" ([#4771](https://github.com/Umisoft/umi.cms.2/pull/4771))
- Исправлено отображение результатов поиска в административной панели при очистке строки поиска ([#4843](https://github.com/Umisoft/umi.cms.2/pull/4843))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))


### Модуль "Баннеры"


#### Исправлено
- Исправлены переключение полей для геотаргетинга в модуле "Баннеры" ([#4452](https://github.com/Umisoft/umi.cms.2/pull/4452))
- Исправлен быстрый экспорт выделенных баннеров в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "Заметки"


#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлено отображение кнопки "закрыть" в окне заметок ([#4581](https://github.com/Umisoft/umi.cms.2/pull/4581))
- Исправлен быстрый экспорт выделенных заметок в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))
- Исправлено удаление заметок в админ панели без перезагрузки страницы ([#5030](https://github.com/Umisoft/umi.cms.2/pull/5030))


### Модуль "Редиректы"


#### Исправлено
- Исправлено удаление со страницы редактирования редиректа ([#4603](https://github.com/Umisoft/umi.cms.2/pull/4603))
- Исправлена валидация пустых полей при добавлении/изменении редиректа ([#4992](https://github.com/Umisoft/umi.cms.2/pull/4992))


### Модуль "Faq"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Удалено
- Удалена подмена заголовка "from" при отправке писем ([#4500](https://github.com/Umisoft/umi.cms.2/pull/4500))


### Модуль "Шаблоны данных"


#### Изменено
- Заблокирована возможность прикрепить существующее поле к тому же типу данных ([#4666](https://github.com/Umisoft/umi.cms.2/pull/4666))
- Скрыты кнопки быстрого экспорта и импорта типов данных и справочников в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))

#### Исправлено
- Исправлен тип поля "Язык" для типа данных "Настройки" ([#4963](https://github.com/Umisoft/umi.cms.2/pull/4963))
- Исправлено удаление полей и групп полей в административной панели ([#4993](https://github.com/Umisoft/umi.cms.2/pull/4993))

#### Удалено
- Удален ложный вывод интерфейса быстрого редактирования в списке типов данных ([#4543](https://github.com/Umisoft/umi.cms.2/pull/4543))


### Модуль "События"


#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлена работа кнопки "Отметить как прочитанное" ([#5006](https://github.com/Umisoft/umi.cms.2/pull/5006))
- Исправлено выделение и снятие выделения со всех событий ([#5006](https://github.com/Umisoft/umi.cms.2/pull/5006))


### Модуль "Меню"


#### Добавлено
- Добавлены поля "Применимо для доменов" и "Применимо для языков" в тип данных "Меню" ([#4692](https://github.com/Umisoft/umi.cms.2/pull/4692))
- Добавлен учет полей "Применимо для доменов" и "Применимо для языков" в административой части модуля ([#4692](https://github.com/Umisoft/umi.cms.2/pull/4692))
- Добавлены аргументы $domainId и $languageId в макрос menu/draw для учета полей "Применимо для доменов" и "Применимо для языков" ([#4692](https://github.com/Umisoft/umi.cms.2/pull/4692))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлена вставка относительных ссылок на файлы ([#4693](https://github.com/Umisoft/umi.cms.2/pull/4693))
- Исправлен быстрый экспорт выделенных объектов в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "Новости"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлена валидация на заполненность полей "Название" и "URL" при создании и редактировании rss-ленты ([#4722](https://github.com/Umisoft/umi.cms.2/pull/4722))
- Добавлено удаление пробелов из начала и конца полей "Название" и "URL" при создании и редактировании rss-ленты ([#4722](https://github.com/Umisoft/umi.cms.2/pull/4722))
- Добавлена обработка исключения при создании и редактировании rss-ленты, когда невозможно получить данные по url ([#4722](https://github.com/Umisoft/umi.cms.2/pull/4722))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлена обработка исключения при создании и редактировании rss-ленты, когда невозможно получить данные по url ([#4758](https://github.com/Umisoft/umi.cms.2/pull/4758))


### Модуль "Блоги"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлен функционал добавления вложенных комментариев для постов и комментариев через административную панель ([#4771](https://github.com/Umisoft/umi.cms.2/pull/4771))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлено отображение результатов поиска в административной панели при очистке строки поиска ([#4843](https://github.com/Umisoft/umi.cms.2/pull/4843))


### Модуль "Фотогалереи"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлены требования к файлу при загрузке фотографий из архива ([#4699](https://github.com/Umisoft/umi.cms.2/pull/4699))


### Модуль "Опросы"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))


### Модуль "Форум"


#### Добавлено
- Добавлен функционал копирования и виртуального копирования ([#4417](https://github.com/Umisoft/umi.cms.2/pull/4417))
- Добавлен функционал добавления вложенных сообщений через административную панель ([#4771](https://github.com/Umisoft/umi.cms.2/pull/4771))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлено добавление сообщения незарегистрированным пользователем ([#5031](https://github.com/Umisoft/umi.cms.2/pull/5031))


### Модуль "Рассылки"


#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлен быстрый экспорт выделенных рассылок, подписчиков, сообщений архива в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "Доступ к сайту"


#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#4516](https://github.com/Umisoft/umi.cms.2/pull/4516))

#### Исправлено
- Исправлен быстрый экспорт выделенных ip-адресов в белом и черном списках в админ панели ([#5020](https://github.com/Umisoft/umi.cms.2/pull/5020))


### Модуль "GeoIp"


#### Добавлено
- Добавлена настройка модуля для отключения логирования исключений ([#4977](https://github.com/Umisoft/umi.cms.2/pull/4977))


### Модуль "Интеграция CRM"


#### Добавлено
- Добавлена поддежка авторизации по протоколу oAuth ([#19](https://github.com/Umisoft/crm-integration-module/pull/19))
- Добавлены публичные поля "Секретный ключ интеграции", "Идентификатор интеграции" и "Код авторизации интеграции" ([#19](https://github.com/Umisoft/crm-integration-module/pull/19))
- Добавлены скрытые поля "Жетон доступа" и "Жетон обновления доступа" ([#19](https://github.com/Umisoft/crm-integration-module/pull/19))

#### Изменено
- Класс http клиента AmoCRM переведен на поддержку guzzle 6.5.2 ([#4345](https://github.com/Umisoft/umi.cms.2/pull/4345))
- Внедрен новый синтаксис для работы с обработчиками событий ([#18](https://github.com/Umisoft/crm-integration-module/pull/18))
- Обновлена справка к группе полей "Авторизация в amoCRM" ([#19](https://github.com/Umisoft/crm-integration-module/pull/19))

#### Исправлено
- Исправлено отображение кнопки "Добавить сценарий" при вызове справки модуля ([#24](https://github.com/Umisoft/crm-integration-module/pull/24))

#### Удалено
- Удалены поля "Логин" и "Пароль" ([#19](https://github.com/Umisoft/crm-integration-module/pull/19))


### Модуль "Push-уведомления"


#### Исправлено
- Переименован модуль "push уведомления" в "push-уведомления" ([#32](https://github.com/Umisoft/push-notification-module/pull/32))


### Расширение "Яндекс Турбо-страницы"


#### Добавлено
- Добавлен вывод идентификатора плагина cms в генерируемые фиды ([#11](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/11/))
- Добавлена блокировка показа неактивных и удаленных страниц, а так же страниц с редиректом ([#12](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/12))
- Добавлен учет прав на просмотр страниц ([#12](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/12))
- Добавлен парсинг tpl макросов для данных турбо-страниц ([#15](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/15))

#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#14](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/14))
- Отключен парсинг макроса content redirect ([#15](https://github.com/Umisoft/yandex-turbo-pages-extension/pull/15))


### Расширение "Мониторинг ошибок"


#### Изменено
- Внедрен новый синтаксис для работы с обработчиками событий ([#3](https://github.com/Umisoft/webmanifest-extension/pull/3))


### Решение Demomarket


#### Добавлено
- Добавлена каптча в форму модуля "Онлайн-запись" ([#26](https://github.com/Umisoft/demomarket-solution/pull/26/))
- Добавлена значение для полей "Предмет расчета" и "Способ расчета" для всех товаров ([#29](https://github.com/Umisoft/demomarket-solution/pull/29))
- Добавлена асинхронная загрузка миникорзины для работы со статическим кешем ([#37](https://github.com/Umisoft/demomarket-solution/pull/37/))
- Добавлена поддержка модуля "Push уведомления" ([#42](https://github.com/Umisoft/demomarket-solution/pull/42))
- Добавлена передача информации о валюте для Robokassa ([#46](https://github.com/Umisoft/demomarket-solution/pull/46))
- Добавлен вывод списка сохраненных юридических лиц при оплате счетом для юридических лиц ([#47](https://github.com/Umisoft/demomarket-solution/pull/47))
- Добавлен вывод формы для использования промокода в корзине ([#82](https://github.com/Umisoft/demomarket-solution/pull/82))
- Добавлено скрытие характеристик в карточке товара, если поле характеристики в типе данных не помечено как "Видимое" ([#112](https://github.com/Umisoft/demomarket-solution/pull/112))
- Добавлен демо-сценарий экспорта каталога в формате CSV ([#111](https://github.com/Umisoft/demomarket-solution/pull/111))
- Добавлено отображение полной итоговой скидки на заказ в корзине ([#113](https://github.com/Umisoft/demomarket-solution/pull/113))
- Добавлено отображение копеек для цен на товары ([#113](https://github.com/Umisoft/demomarket-solution/pull/113))

#### Изменено
- Убрано отображение кнопки "добавить в сравнение" на мобильных устройствах ([#25](https://github.com/Umisoft/demomarket-solution/pull/25))
- Обновлены уязвимые npm пакеты ([#35](https://github.com/Umisoft/demomarket-solution/pull/35))
- Внедрен единый метод получения номера страницы в рамках пагинации ([#36](https://github.com/Umisoft/demomarket-solution/pull/36/))
- Обновлены уязвимые npm пакеты ([#49](https://github.com/Umisoft/demomarket-solution/pull/49))
- Удалены instagram и twitter из виджета регистрации Ulogin ([#74](https://github.com/Umisoft/demomarket-solution/pull/74))
- Обновлена fancybox до версии 3.5.7 ([#80](https://github.com/Umisoft/demomarket-solution/pull/80))
- "Яндекс.Касса" и "Яндекс.Деньги" переименованы в "ЮKassa" и "ЮMoney" ([#95](https://github.com/Umisoft/demomarket-solution/pull/95))

#### Исправлено
- Исправлена валидация галочки персональных данных на шаге доставки оформления заказа ([#27](https://github.com/Umisoft/demomarket-solution/pull/27))
- Исправлен вывод разделителя разряда цен в корзине при оформлении заказа в 1 шаг ([#28](https://github.com/Umisoft/demomarket-solution/pull/28))
- Исправлена форма оплаты через PayOnline ([#32](https://github.com/Umisoft/demomarket-solution/pull/32))
- Исправлено открытие окна с платежной квитанцией ([#33](https://github.com/Umisoft/demomarket-solution/pull/33))
- Исправлены стили eip ([#30](https://github.com/Umisoft/demomarket-solution/pull/30))
- Исправлен демонстрационный контент для apiship ([#39](https://github.com/Umisoft/demomarket-solution/pull/39))
- Исправлена валидация галочки персональных данных на шаге доставки оформления заказа в 1 шаг ([#41](https://github.com/Umisoft/demomarket-solution/pull/41))
- Исправлено отображение ошибок исключений ([#41](https://github.com/Umisoft/demomarket-solution/pull/51))
- Исправлено отображение миникорзины при большом количестве товаров ([#3315](http://youtrack.umisoft.ru/issue/cms2-3315))
- Исправлены всплывающие кнопки фильтрации товаров ([#53](https://github.com/Umisoft/demomarket-solution/pull/53))
- Исправлено добавление нового адреса при заказе в один шаг ([#54](https://github.com/Umisoft/demomarket-solution/pull/54))
- Исправлено добавление способа доставки в заказ, если он не был выбран ([#59](https://github.com/Umisoft/demomarket-solution/pull/59))
- Исправлена верстка цен в корзине при оформлении заказа в 1 шаг ([#64](https://github.com/Umisoft/demomarket-solution/pull/64))
- Исправлена верстка названия товаров в корзине при оформлении заказа в 1 шаг ([#70](https://github.com/Umisoft/demomarket-solution/pull/70))
- Исправлена невозможность выбрать способ оплаты типа "Платежная квитанция" при оформлении заказа ([#73](https://github.com/Umisoft/demomarket-solution/pull/73))
- Исправлена верстка окна поиска на мобильных экранах ([#75](https://github.com/Umisoft/demomarket-solution/pull/75))
- Исправлена работа карты на странице контактов ([#78](https://github.com/Umisoft/demomarket-solution/pull/78))
- Исправлена верстка всплывающего окна поиска на мобильных экранах. ([#79](https://github.com/Umisoft/demomarket-solution/pull/79))
- Исправлена неправильная работа фильтров товаров при одинаковом максимальном и минимальном значение. ([#85](https://github.com/Umisoft/demomarket-solution/pull/85))
- Исправлено сохранение способа доставки типа "Самовывоз" в заказе в 1 клик ([#86](https://github.com/Umisoft/demomarket-solution/pull/86))
- Исправлено сохранение способа доставки типа "Самовывоз" в поэтапном заказе ([#89](https://github.com/Umisoft/demomarket-solution/pull/89))
- Исправлена работа кнопки "Удалить из сравнения" ([#100](https://github.com/Umisoft/demomarket-solution/pull/100))
- Исправлена работа кнопки "Мне все равно" при онлайн-записи ([#101](https://github.com/Umisoft/demomarket-solution/pull/101))
- Исправлено отображение виджета Api-ship ([#116](https://github.com/Umisoft/demomarket-solution/pull/116))
- Исправлено отображение способов доставки в корзине, которая наполняется для супервайзера при установке шаблона ([#117](https://github.com/Umisoft/demomarket-solution/pull/117))
- Исправлены недочеты в верстке шаблона ([#118](https://github.com/Umisoft/demomarket-solution/pull/118))
- Исправлено отображение кнопки "Удалить из сравнения", если товар не был добавлен для сравнения ([#118](https://github.com/Umisoft/demomarket-solution/pull/118))

#### Удалено
- Удалены шаблоны для платежной системы Rbk Money ([#44](https://github.com/Umisoft/demomarket-solution/pull/44))
- Удалены шаблоны для платежной системы КупиВКредит ([#45](https://github.com/Umisoft/demomarket-solution/pull/45))
- Удалены шаблоны для модуля "Eshop" ([#45](https://github.com/Umisoft/demomarket-solution/pull/45))
- Удалены данные платежных систем "Rbk Money", "КупиВКредит", "AcquiroPay" и "Яндекс.Касса (старое api)" ([#45](https://github.com/Umisoft/demomarket-solution/pull/55))
- Удалены шаблоны для платежных систем "AcquiroPay" и "Яндекс.Касса (старое api)" ([#45](https://github.com/Umisoft/demomarket-solution/pull/55))
- Удалены демо-сценарии экспорта ([#108](https://github.com/Umisoft/demomarket-solution/pull/108))


### Решение Demotractor


#### Изменено
- Обновлены уязвимые npm пакеты ([#14](https://github.com/Umisoft/demotractor-solution/pull/14))
- Обновлены уязвимые npm пакеты ([#16](https://github.com/Umisoft/demotractor-solution/pull/16))
- Обновлена fancybox до версии 3.5.7 ([#19](https://github.com/Umisoft/demotractor-solution/pull/19))
- "Яндекс.Касса" и "Яндекс.Деньги" переименованы в "ЮKassa" и "ЮMoney" ([#22](https://github.com/Umisoft/demotractor-solution/pull/22))

#### Удалено
- Удалены шаблоны для модуля "Eshop" и устаревших платежных систем модуля "Emarket" ([#16](https://github.com/Umisoft/demotractor-solution/pull/16))
- Удалены данные платежных систем "Rbk Money", "КупиВКредит", "AcquiroPay" и "Яндекс.Касса (старое api)" ([#16](https://github.com/Umisoft/demotractor-solution/pull/16))


### Решение Demolancer


#### Изменено
- Обновлены уязвимые npm пакеты ([#14](https://github.com/Umisoft/demolancer-solution/pull/14))
- Обновлены уязвимые npm пакеты ([#16](https://github.com/Umisoft/demolancer-solution/pull/16))
- Обновлена fancybox до версии 3.5.7 ([#19](https://github.com/Umisoft/demolancer-solution/pull/19))
- "Яндекс.Касса" и "Яндекс.Деньги" переименованы в "ЮKassa" и "ЮMoney" ([#22](https://github.com/Umisoft/demolancer-solution/pull/22))

#### Удалено
- Удалены шаблоны для модуля "Eshop" и устаревших платежных систем модуля "Emarket" ([#16](https://github.com/Umisoft/demolancer-solution/pull/16))
- Удалены данные платежных систем "Rbk Money", "КупиВКредит", "AcquiroPay" и "Яндекс.Касса (старое api)" ([#16](https://github.com/Umisoft/demolancer-solution/pull/16))


### Готовые решения


#### Исправлено
- Исправлены стили eip ([#610](https://github.com/Umisoft/umi.cms2-builder/pull/610/))
- Исправлено отображение чекбоксов ПДН в формах обратной связи ([#640](https://github.com/Umisoft/umi.cms2-builder/pull/640))
- Исправлено отображение чекбоксов ПДН при оформлении заказов ([#645](https://github.com/Umisoft/umi.cms2-builder/pull/645))
- Исправлены пути до минифицированных статических файлов ([#641](https://github.com/Umisoft/umi.cms2-builder/pull/641))
- Исправлена кодировка названий способов оплаты и доставки ([#647](https://github.com/Umisoft/umi.cms2-builder/pull/647))
- Исправлено отображение формы обратной связи ([#677](https://github.com/Umisoft/umi.cms2-builder/pull/677))

#### Изменено
- Обновлена fancybox до версии 3.5.7 ([#664](https://github.com/Umisoft/umi.cms2-builder/pull/664))
- "Яндекс.Касса" и "Яндекс.Деньги" переименованы в "ЮKassa" и "ЮMoney" ([#669](https://github.com/Umisoft/umi.cms2-builder/pull/669))

#### Удалено
- Удалены данные платежных систем "Rbk Money", "КупиВКредит", "AcquiroPay" и "Яндекс.Касса (старое api)" ([#646](https://github.com/Umisoft/umi.cms2-builder/pull/646))
