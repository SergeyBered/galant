<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Шаблон вкладки "Список шаблонов" -->
	<xsl:template match="/result[@method = 'getTemplateList']/data[@type = 'list' and @action = 'view']">
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
								<xsl:value-of select="concat($lang-prefix, '/admin/umiTemplates/flushTemplateListConfig/.json')" />
							</xsl:with-param>
							<xsl:with-param name="showDomain">1</xsl:with-param>
							<xsl:with-param name="dragAllowed">0</xsl:with-param>
							<xsl:with-param name="toolbarFunction">TemplatesModule.getTemplatesListToolBarFunctions()</xsl:with-param>
							<xsl:with-param name="toolbarMenu">TemplatesModule.getTemplatesListToolBarMenu()</xsl:with-param>
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

	<!-- Шаблон вкладки "Привязанные страницы" -->
	<xsl:template match="/result[@method = 'getRelatedPageTree']/data[@type = 'list' and @action = 'view']">
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
								<xsl:value-of select="concat($lang-prefix, '/admin/umiTemplates/flushRelatedPageTreeConfig/.json')" />
							</xsl:with-param>
							<xsl:with-param name="showDomain">1</xsl:with-param>
							<xsl:with-param name="dragAllowed">1</xsl:with-param>
							<xsl:with-param name="toolbarFunction">TemplatesModule.getRelatedPageTreeToolBarFunctions()</xsl:with-param>
							<xsl:with-param name="toolbarMenu">TemplatesModule.getRelatedPageTreeToolBarMenu()</xsl:with-param>
							<xsl:with-param name="dropValidator">TemplatesModule.getRelatedPageTreeDragAndDropValidator</xsl:with-param>
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

	<!-- Шаблон вкладки "Бекапы" -->
	<xsl:template match="/result[@method = 'getTemplateBackups']/data[@type = 'list' and @action = 'view']">
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
								<xsl:value-of select="concat($lang-prefix, '/admin/umiTemplates/flushTemplateBackupsConfig/.json')" />
							</xsl:with-param>
							<xsl:with-param name="showDomain">0</xsl:with-param>
							<xsl:with-param name="dragAllowed">0</xsl:with-param>
							<xsl:with-param name="toolbarFunction">TemplatesModule.getTemplateBackupsToolBarFunctions()</xsl:with-param>
							<xsl:with-param name="toolbarMenu">TemplatesModule.getTemplateBackupsToolBarMenu()</xsl:with-param>
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

</xsl:stylesheet>