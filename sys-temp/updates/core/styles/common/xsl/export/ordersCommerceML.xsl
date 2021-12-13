<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:php="http://php.net/xsl"
				xmlns:umi="http://www.umi-cms.ru/TR/umi" xmlns:xs="http://www.w3.org/1999/XSL/Transform"
				extension-element-prefixes="php"
				exclude-result-prefixes="xsl php">

	<xsl:output method="xml" encoding="utf-8"/>

	<!-- Список доступных валют -->
	<xsl:variable name="currency" select="document('udata://emarket/currencySelector/')/udata/items" />

	<!-- Список валюты по-умолчанию -->
	<xsl:variable name="default-currency" select="$currency/item[@default = 'default']/@codename" />

	<!-- Ставка НДС по-умолчанию -->
	<xs:variable name="default-vat-id" select="document('udata://emarket/getDefaultVatId/')/udata"/>

	<!-- Корневой шаблон -->
	<xsl:template match="umidump[@version='2.0']">
		<xsl:variable name="date" select="php:function('date', 'Y-m-d')" />
		<КоммерческаяИнформация ВерсияСхемы="2.01" ДатаФормирования="{$date}">
			<xsl:apply-templates select="objects/object[properties/group/@name='order_props']" mode="order" />
		</КоммерческаяИнформация>
	</xsl:template>

	<!-- Шаблон обработки ошибок -->
	<xsl:template match="umidump">
		<error>Unknown umidump version</error>
	</xsl:template>

	<!-- Шаблон заказа -->
	<xsl:template match="object" mode="order">
		<xsl:param name="order_num" select="properties/group/property[@name='number']/value" />
		<xsl:param name="status_change_date" select="string(properties/group/property[@name='status_change_date']/value/@unix-timestamp)" />
		<xsl:param name="order_date" select="string(properties/group/property[@name='order_date']/value/@unix-timestamp)" />
		<xsl:param name="total_price" select="properties/group/property[@name='total_price']/value" />
		<xsl:param name="customer_id" select="properties/group/property[@name='customer_id']/value/item/@id" />
		<xsl:param name="customer_comments" select="properties/group/property[@name='comments']/value" />

		<xsl:param name="order_status_id" select="number(properties/group/property[@name='status_id']/value/item/@id)" />
		<xsl:param name="order_status" select="document(concat('uobject://', $order_status_id))/udata/object" />
		<xsl:param name="order_status_codename" select="string($order_status//property[@name='codename']/value)" />

		<xsl:param name="payment_date" select="string(properties/group/property[@name='payment_date']/value/@unix-timestamp)" />
		<xsl:param name="payment_document_num" select="string(properties/group/property[@name='payment_document_num']/value)" />
		<xsl:param name="payment_type" select="string(properties/group/property[@name='payment_id']/value/item/@name)" />
		<xsl:param name="payment_status_id" select="number(properties/group/property[@name='payment_status_id']/value/item/@id)" />
		<xsl:param name="payment_status_codename" select="string(document(concat('uobject://', $payment_status_id))//property[@name='codename']/value)" />

		<xsl:param name="delivery" select="properties/group[@name='order_delivery_props']" />
		<xsl:param name="delivery_allow_date" select="string(properties/group/property[@name='delivery_allow_date']/value/@unix-timestamp)" />
		<xsl:param name="delivery-address" select="document(concat('uobject://', $delivery/property[@name='delivery_address']/value/item[1]/@id))/udata/object/properties/group" />

		<Документ>
			<Ид><xsl:value-of select="@id" /></Ид>
			<Номер><xsl:value-of select="@id" /></Номер>
			<Дата>
				<xsl:if test="string-length($order_date)">
					<xsl:value-of select="php:function('date', 'Y-m-d', $order_date)" />
				</xsl:if>
			</Дата>
			<ХозОперация>Заказ товара</ХозОперация>
			<Роль>Продавец</Роль>
			<Валюта>руб</Валюта>
			<Курс>1</Курс>
			<Сумма><xsl:value-of select="$total_price" /></Сумма>
			<xsl:if test="string-length($order_date)">
				<Время><xsl:value-of select="php:function('date', 'H:i:s', $order_date)" /></Время>
			</xsl:if>
			<Комментарий>Заказ №<xsl:value-of select="$order_num" /></Комментарий>
			<xsl:if test="$customer_id">
				<Контрагенты>
					<xsl:apply-templates select="document(concat('uobject://', $customer_id))/udata/object" mode="customer" />
				</Контрагенты>
			</xsl:if>

			<Товары>
				<xsl:apply-templates select="properties/group/property[@name='delivery_price']/value" mode="delivery">
					<xsl:with-param name="delivery-id">
						<xsl:value-of select="properties/group/property[@name='delivery_id']/value/item/@id" />
					</xsl:with-param>
				</xsl:apply-templates>
				<xsl:apply-templates select="properties/group/property[@name='order_items']/value/item" mode="order-item" />
			</Товары>

			<ЗначенияРеквизитов>
				<xsl:if test="string-length($payment_date)">
					<ЗначениеРеквизита>
						<Наименование>Дата оплаты</Наименование>
						<Значение><xsl:value-of select="php:function('date', 'Y-m-d', $payment_date)" /></Значение>
					</ЗначениеРеквизита>
				</xsl:if>

				<xsl:if test="string-length($payment_document_num)">
					<ЗначениеРеквизита>
						<Наименование>Номер платежного документа</Наименование>
						<Значение><xsl:value-of select="$payment_document_num" /></Значение>
					</ЗначениеРеквизита>
				</xsl:if>

				<xsl:if test="string-length($payment_type)">
					<ЗначениеРеквизита>
						<Наименование>Метод оплаты</Наименование>
						<Значение><xsl:value-of select="$payment_type" /></Значение>
					</ЗначениеРеквизита>
				</xsl:if>

				<xsl:if test="string-length($delivery_allow_date)">
					<ЗначениеРеквизита>
						<Наименование>Дата разрешения доставки</Наименование>
						<Значение><xsl:value-of select="php:function('date', 'Y-m-d', $delivery_allow_date)" /></Значение>
					</ЗначениеРеквизита>
					<ЗначениеРеквизита>
						<Наименование>Доставка разрешена</Наименование>
						<Значение>true</Значение>
					</ЗначениеРеквизита>
				</xsl:if>

				<ЗначениеРеквизита>
					<Наименование>Заказ оплачен</Наименование>
					<Значение>
						<xsl:choose>
							<xsl:when test="$payment_status_codename = 'accepted'">true</xsl:when>
							<xsl:otherwise>false</xsl:otherwise>
						</xsl:choose>
					</Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Отменен</Наименование>
					<Значение>
						<xsl:choose>
							<xsl:when test="$order_status_codename = 'canceled'">true</xsl:when>
							<xsl:otherwise>false</xsl:otherwise>
						</xsl:choose>
					</Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Финальный статус</Наименование>
					<Значение>
						<xsl:choose>
							<xsl:when test="$order_status_codename = 'ready'">true</xsl:when>
							<xsl:otherwise>false</xsl:otherwise>
						</xsl:choose>
					</Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Статус заказа</Наименование>
					<Значение><xsl:value-of select="$order_status/@name" /></Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Статуса заказа ИД</Наименование>
					<Значение><xsl:value-of select="$order_status_id" /></Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Способ доставки</Наименование>
					<Значение>
						<xsl:variable name="delivery_name" select="//property[@name='delivery_name']/value" />
						<xsl:value-of select="substring($delivery_name, 1, 50)" />
					</Значение>
				</ЗначениеРеквизита>

				<ЗначениеРеквизита>
					<Наименование>Адрес доставки</Наименование>
					<Значение>
						<xsl:variable name="delivery-country" select="$delivery-address/property[@name='country']/value/item[1]/@name" />
						<xsl:variable name="delivery-index" select="$delivery-address/property[@name='index']/value" />
						<xsl:variable name="delivery-region" select="$delivery-address/property[@name='region']/value" />
						<xsl:variable name="delivery-city" select="$delivery-address/property[@name='city']/value" />
						<xsl:variable name="delivery-street" select="$delivery-address/property[@name='street']/value" />
						<xsl:variable name="delivery-house" select="$delivery-address/property[@name='house']/value" />
						<xsl:variable name="delivery-flat" select="$delivery-address/property[@name='flat']/value" />

						<xsl:value-of select="concat($delivery-index, ', ', $delivery-country, ', ', $delivery-region, ', ',
						$delivery-city, ', ', $delivery-street, ', ', $delivery-house, ', ', $delivery-flat)" />
					</Значение>
				</ЗначениеРеквизита>

				<xsl:if test="string-length($status_change_date)">
					<ЗначениеРеквизита>
						<Наименование>Дата изменения статуса</Наименование>
						<Значение><xsl:value-of select="php:function('date', 'Y-m-d H:i', $status_change_date)" /></Значение>
					</ЗначениеРеквизита>
				</xsl:if>
			</ЗначенияРеквизитов>

			<xsl:apply-templates select="." mode="vat">
				<xsl:with-param name="vat-id">
					<xsl:value-of select="$default-vat-id"/>
				</xsl:with-param>
			</xsl:apply-templates>
		</Документ>
	</xsl:template>

	<!-- Шаблон наименования заказа -->
	<xsl:template match="item" mode="order-item">
		<xsl:apply-templates select="document(concat('uobject://', @id))/udata/object" mode="order-item" />
	</xsl:template>

	<!-- Шаблон товара -->
	<xsl:template match="object" mode="order-item">
		<xsl:param name="good-id" select="properties/group/property[@name='item_link']/value/page/@id" />
		<xsl:param name="good" select="document(concat('upage://', $good-id))/udata/page" />
		<xsl:param name="item_price" select="properties/group/property[@name='item_price']/value" />
		<xsl:param name="item_amount" select="properties/group/property[@name='item_amount']/value" />
		<xsl:param name="item_total_price" select="properties/group/property[@name='item_total_price']/value" />
		<xsl:param name="offer" select="properties/group/property[@name='trade_offer']/value/offer" />
		<xsl:param name="offer.id" select="document(concat('udata://exchange/getCmlOfferExternalId/', $offer/@id))/udata" />
		<xsl:param name="vat-id" select="string(properties/group/property[@name='tax_rate_id']/value/item/@id)" />

		<Товар>
			<xsl:choose>
				<xsl:when test="not($good)">
					<Ид><xsl:value-of select="@id" /></Ид>
				</xsl:when>
				<xsl:when test="$good//property[@name = '1c_product_id']/value">
					<xsl:choose>
						<xsl:when test="string-length($offer.id)">
							<Ид><xsl:value-of select="$good//property[@name = '1c_product_id']/value" />#<xsl:value-of select="$offer.id" /></Ид>
						</xsl:when>
						<xsl:otherwise>
							<Ид><xsl:value-of select="$good//property[@name = '1c_product_id']/value" /></Ид>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<Ид><xsl:value-of select="$good-id" /></Ид>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="$good//property[@name = '1c_catalog_id']/value">
				<ИдКаталога><xsl:value-of select="$good//property[@name = '1c_catalog_id']/value" /></ИдКаталога>
			</xsl:if>
			<Наименование>
				<xsl:choose>
					<xsl:when test="$offer/@name">
						<xsl:value-of select="$offer/@name" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$good/name | @name" />
					</xsl:otherwise>
				</xsl:choose>
			</Наименование>
			<БазоваяЕдиница Код="796" НаименованиеПолное="Штука" МеждународноеСокращение="PCE">шт</БазоваяЕдиница>

			<ЦенаЗаЕдиницу><xsl:value-of select="$item_price" /></ЦенаЗаЕдиницу>
			<Сумма><xsl:value-of select="$item_total_price" /></Сумма>
			<Количество><xsl:value-of select="$item_amount" /></Количество>
			<Единица>шт</Единица>
			<Коэффициент>1</Коэффициент>

			<ЗначенияРеквизитов>
				<ЗначениеРеквизита>
				<Наименование>ВидНоменклатуры</Наименование>
				<Значение>Товар</Значение>
				</ЗначениеРеквизита>
				<ЗначениеРеквизита>
				<Наименование>ТипНоменклатуры</Наименование>
				<Значение>Товар</Значение>
				</ЗначениеРеквизита>
			</ЗначенияРеквизитов>

			<xsl:apply-templates select="." mode="vat">
				<xsl:with-param name="vat-id">
					<xsl:value-of select="$vat-id"/>
				</xsl:with-param>
			</xsl:apply-templates>
		</Товар>
	</xsl:template>

	<!-- Шаблон доставки -->
	<xsl:template match="value" mode="delivery">
		<xsl:param name="delivery-id">0</xsl:param>
		<xsl:param name="vat-id" select="document(concat('uobject://', $delivery-id, '.tax_rate_id'))/udata/property/value/item/@id"/>
		<xsl:variable name="price_delivery" select="." />

		<xsl:if test="$price_delivery &gt; 0">
			<Товар>
				<Ид>ORDER_DELIVERY</Ид>
				<Наименование>Доставка заказа</Наименование>
				<БазоваяЕдиница Код="796" НаименованиеПолное="Штука" МеждународноеСокращение="PCE">шт</БазоваяЕдиница>
				<ЦенаЗаЕдиницу>
					<xsl:value-of select="$price_delivery" />
				</ЦенаЗаЕдиницу>
				<Количество>1</Количество>
				<Сумма>
					<xsl:value-of select="$price_delivery" />
				</Сумма>
				<ЗначенияРеквизитов>
					<ЗначениеРеквизита>
						<Наименование>ВидНоменклатуры</Наименование>
						<Значение>Услуга</Значение>
					</ЗначениеРеквизита>
					<ЗначениеРеквизита>
						<Наименование>ТипНоменклатуры</Наименование>
						<Значение>Услуга</Значение>
					</ЗначениеРеквизита>
				</ЗначенияРеквизитов>

				<xsl:apply-templates select="document(concat('uobject://', $delivery-id))/udata" mode="vat">
					<xsl:with-param name="vat-id">
						<xsl:value-of select="$vat-id"/>
					</xsl:with-param>
				</xsl:apply-templates>
			</Товар>
		</xsl:if>
	</xsl:template>

	<!-- Шаблон ставки НДС -->
	<xsl:template match="object" mode="vat">
		<xsl:param name="vat-id"/>
		<xsl:if test="$vat-id">
			<xsl:variable name="vat-value" select="document(concat('uobject://', $vat-id, '.tax'))/udata/property/value"/>
			<xsl:choose>
				<xsl:when test="$vat-value = 'none'"></xsl:when>
				<xsl:when test="$vat-value">
					<Налоги>
						<Налог>
							<Наименование>
								<xsl:text>НДС</xsl:text>
							</Наименование>
							<Ставка>
								<xsl:value-of select="$vat-value" />
							</Ставка>
							<УчтеноВСумме>
								<xsl:text>true</xsl:text>
							</УчтеноВСумме>
						</Налог>
					</Налоги>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!-- Шаблон контрагента -->
	<xsl:template match="object" mode="customer">
		<Контрагент>
			<Ид><xsl:value-of select="@id" /></Ид>
			<Наименование><xsl:value-of select="//property[@name='fname']/value" />&#160;<xsl:value-of select="//property[@name='lname']/value" /></Наименование>
			<ПолноеНаименование><xsl:value-of select="//property[@name='fname']/value" />&#160;<xsl:value-of select="//property[@name='lname']/value" /></ПолноеНаименование>
			<Роль>Покупатель</Роль>
			<Фамилия><xsl:value-of select="//property[@name='lname']/value" /></Фамилия>
			<Имя><xsl:value-of select="//property[@name='fname']/value" /></Имя>
		</Контрагент>
	</xsl:template>

	<xsl:include href="custom/ordersCommerceML.xsl" />
	<xsl:include href="udata://core/includeExchangeXsl/export/ordersCommerceML" />

</xsl:stylesheet>
