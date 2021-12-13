<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common/exchange" [
	<!ENTITY sys-module        'exchange'>
	<!ENTITY sys-method-add        'add'>
	<!ENTITY sys-method-edit    'edit'>
	<!ENTITY sys-method-del        'del'>

]>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Шаблон вкладки "Импорт данных" -->
	<xsl:template match="result[@method = 'import']/data">
		<script src="/styles/skins/modern/design/js/{$module}.list.view.js" />

		<div class="location">
			<div class="imgButtonWrapper loc-left">
				<a href="{$lang-prefix}/admin/&sys-module;/add/import/" class="btn color-blue">
					<xsl:text>&label-add-import;</xsl:text>
				</a>
				<a href="#" id="doImport" onclick="exchangeDoImport(); return false;" class="btn color-blue">
					<xsl:text>&label-import-do;</xsl:text>
				</a>
			</div>
			<xsl:call-template name="entities.help.button" />
		</div>

		<div class="layout">
			<div class="column">
				<xsl:call-template name="ui-smc-table">
					<xsl:with-param name="control-params" select="$method" />
					<xsl:with-param name="content-type">objects</xsl:with-param>

					<xsl:with-param name="js-add-buttons">
						createAddButton(
							$('#doImport')[0],	oTable, '#', ['*']
						);
					</xsl:with-param>
				</xsl:call-template>
			</div>
			<div class="column">
				<xsl:call-template name="entities.help.content" />
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон вкладки "Экспорт данных" -->
	<xsl:template match="result[@method = 'export']/data">
		<script type="text/javascript">
			var lang_prefix = '<xsl:value-of select="$lang-prefix" />';
		</script>

		<script src="/styles/skins/modern/design/js/{$module}.list.view.js" />

		<div class="location">
			<div class="imgButtonWrapper loc-left">
				<a href="{$lang-prefix}/admin/&sys-module;/add/export/" class="btn color-blue">
					<xsl:text>&label-add-export;</xsl:text>
				</a>
				<a href="#" id="doExport" onclick="exchangeDoExport(); return false;" class="btn color-blue">
					<xsl:text>&label-export-do;</xsl:text>
				</a>
				<a href="#" id="prepareExport" onclick="prepareExport(); return false;" class="btn color-blue">
					<xsl:text>&js-exchange-prepare-export;</xsl:text>
				</a>
			</div>
			<xsl:call-template name="entities.help.button" />
		</div>

		<div class="layout">
			<div class="column">
				<xsl:call-template name="ui-smc-table">
					<xsl:with-param name="control-params" select="$method" />
					<xsl:with-param name="content-type">objects</xsl:with-param>

					<xsl:with-param name="js-add-buttons">
						createAddButton(
							$('#doExport')[0],	oTable, '#', ['*']
						);
						createAddButton(
							$('#prepareExport')[0],	oTable, '#', ['*'], function(tableItem) {
								var format = tableItem.getProperty('format');
								var formatGuid = (format.value.item &amp;&amp; format.value.item.guid) ? format.value.item.guid : '';
								return formatGuid === 'ff6c38d4ab12cda6c035cf36a4afb829049fbf21'; // Гуид YML
							}
						);
					</xsl:with-param>

				</xsl:call-template>
			</div>
			<div class="column">
				<xsl:call-template name="entities.help.content" />
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон вкладки "Список логов" -->
	<xsl:template match="result[@method = 'logList']/data">
		<div class="tabs-content module">
			<div class="section selected">
				<div class="location">
					<xsl:call-template name="entities.help.button"/>
				</div>
				<div class="layout">
					<div class="column">
						<xsl:call-template name="ui-new-table">
							<xsl:with-param name="controlParam"><xsl:value-of select="@method"/></xsl:with-param>
							<xsl:with-param name="configUrl">
								<xsl:value-of select="concat($lang-prefix, '/admin/exchange/flushLogListConfig/.json')" />
							</xsl:with-param>
							<xsl:with-param name="showDomain">1</xsl:with-param>
							<xsl:with-param name="dragAllowed">0</xsl:with-param>
							<xsl:with-param name="toolbarFunction">ExchangeModule.getLogListToolBarFunctions()</xsl:with-param>
							<xsl:with-param name="toolbarMenu">ExchangeModule.getLogListToolBarMenu()</xsl:with-param>
							<xsl:with-param name="perPageLimit">20</xsl:with-param>
						</xsl:call-template>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content"/>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>

	<xsl:param name="page"/>
	<!-- Шаблон раздела "1С Идентификаторы" -->
	<xsl:template match="result[@method = 'categoryIdentifiers' or @method = 'objectIdentifiers']">
		<xsl:param name="url-suffix">
			<xsl:choose>
				<xsl:when test="$page">
					<xsl:value-of select="concat('/', $page, '/.json')"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>/.json</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:param>

		<div class="tabs-content module">
			<div class="section selected">
				<div class="location">
					<xsl:call-template name="entities.help.button"/>
				</div>
				<div class="layout">
					<div class="column">
						<div id="stat_links">
							<xsl:call-template name="identifiers_links">
								<xsl:with-param name="link" select="'categoryIdentifiers'" />
								<xsl:with-param name="label" select="'&menu-categories-identifiers;'" />
							</xsl:call-template>
							<xsl:call-template name="identifiers_links">
								<xsl:with-param name="link" select="'objectIdentifiers'" />
								<xsl:with-param name="label" select="'&menu-objects-identifiers;'" />
							</xsl:call-template>
						</div>
						<xsl:call-template name="ui-new-table">
							<xsl:with-param name="controlParam"><xsl:value-of select="@method"/></xsl:with-param>
							<xsl:with-param name="configUrl">
								<xsl:choose>
									<xsl:when test="@method = 'categoryIdentifiers'">
										<xsl:value-of select="concat($lang-prefix, '/admin/exchange/flushCategoryIdentifiersConfig', $url-suffix)"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat($lang-prefix, '/admin/exchange/flushObjectIdentifiersConfig', $url-suffix)"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:with-param>
							<xsl:with-param name="showDomain">1</xsl:with-param>
							<xsl:with-param name="showSelectButtons">0</xsl:with-param>
							<xsl:with-param name="perPageLimit">20</xsl:with-param>
							<xsl:with-param name="toolbarFunction">ExchangeModule.getIdentifiersToolBarFunctions()</xsl:with-param>
							<xsl:with-param name="toolbarMenu">ExchangeModule.getIdentifiersToolBarMenu()</xsl:with-param>
						</xsl:call-template>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content"/>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон табов в разделе "1С Идентификаторы" -->
	<xsl:template name="identifiers_links">
		<xsl:param name="link" />
		<xsl:param name="label" />
		<xsl:choose>
			<xsl:when test="@method = $link">
				<span><xsl:value-of select="$label" /></span>
			</xsl:when>
			<xsl:otherwise>
				<a href="/admin/&sys-module;/{$link}/">
					<xsl:value-of select="$label" />
				</a>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
