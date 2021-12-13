<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common/catalog">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!-- Шаблон блока с информацией об 1С-идентификаторе -->
	<xsl:template match="/result/data/id-1c" mode="form-modify">
		<xsl:variable name="groupIsHidden" select="contains($hiddenGroupNameList, 'id-1c')"/>

		<div name="g_id-1c">
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="$groupIsHidden">
						<xsl:text>panel-settings has-border id-1c</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>panel-settings id-1c</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<a data-name="id-1c" data-label="&label-1c-identifier-field;" />
			<div class="title">
				<div class="field-group-toggle">
					<div>
						<xsl:attribute name="class">
							<xsl:choose>
								<xsl:when test="$groupIsHidden">
									<xsl:text>round-toggle switch</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>round-toggle</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</div>
					<h3>&label-1c-identifier-field;</h3>
				</div>
			</div>
			<div class="content">
				<xsl:if test="$groupIsHidden">
					<xsl:attribute name="style">
						<xsl:text>display: none;</xsl:text>
					</xsl:attribute>
				</xsl:if>

				<xsl:variable name="page-type" select="/result/data/page/basetype/@method"/>
				<xsl:variable name="page-id" select="/result/data/page/@id"/>

				<div class="layout">
					<div class="column">
						<div class="row">
							<input id="id-1c" class="default" type="text" readonly="readonly" disabled="disabled" value="{.}"/>
							<xsl:choose>
								<xsl:when test="$page-type = 'object'">
									<a href="/admin/exchange/objectIdentifiers/?page={$page-id}" target="_blank">&label-1c-identifier-editor-link;</a>
								</xsl:when>
								<xsl:otherwise>
									<a href="/admin/exchange/categoryIdentifiers/?page={$page-id}" target="_blank">&label-1c-identifier-editor-link;</a>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</div>
					<div class="column">

					</div>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>