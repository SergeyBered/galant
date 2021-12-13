<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="/result[@method = 'mail_config']/data[@type = 'settings' and @action = 'modify']">
		<div class="location">
			<xsl:call-template name="entities.help.button" />
		</div>

		<div class="layout">
			<div class="column">
				<form method="post" action="do/" enctype="multipart/form-data">
					<xsl:apply-templates select="." mode="settings-modify"/>
					<div class="row">
						<xsl:call-template name="std-form-buttons-settings" />
					</div>
				</form>
				<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo"/>
			</div>

			<div class="column">
				<xsl:call-template name="entities.help.content" />
			</div>
		</div>
	</xsl:template>

	<xsl:template match="/result[@method = 'mail_config']//group[@name = 'status-notifications']" mode="settings-modify">
		<div class="panel-settings">
			<div class="title">
				<h3>
					<xsl:value-of select="@label" />
				</h3>
			</div>
			<div class="content">
				<table class="btable btable-striped">
					<tbody>
						<xsl:apply-templates select="option" mode="settings.modify" />
					</tbody>
				</table>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="/result[@method = 'mail_config']//group[@name != 'status-notifications']" mode="settings-modify">
		<xsl:variable name="from-email" select="option[position() = 2]" />
		<xsl:variable name="from-name" select="option[position() = 3]" />
		<xsl:variable name="manager-email" select="option[position() = 4]" />

		<table class="btable btable-striped">
			<thead>
				<tr>
					<th colspan="2" class="eq-col">
						<xsl:value-of select="option[@name = 'domain']/value" />
					</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>
						<label for="{$from-email/@name}">
							<xsl:text>&option-email;</xsl:text>
						</label>
					</td>

					<td>
						<input class="default" type="text" name="{$from-email/@name}" value="{$from-email/value}" id="{$from-email/@name}" />
					</td>
				</tr>

				<tr>
					<td class="eq-col">
						<label for="{$from-name/@name}">
							<xsl:text>&option-name;</xsl:text>
						</label>
					</td>

					<td>
						<input class="default" type="text" name="{$from-name/@name}" value="{$from-name/value}" id="{$from-name/@name}" />
					</td>
				</tr>

				<tr>
					<td class="eq-col">
						<label for="{$manager-email/@name}">
							<xsl:text>&option-manageremail;</xsl:text>
						</label>
					</td>

					<td>
						<input class="default" type="text" name="{$manager-email/@name}" value="{$manager-email/value}" id="{$manager-email/@name}" />
					</td>
				</tr>
			</tbody>
		</table>
	</xsl:template>

	<xsl:template match="/result[@method = 'config']/data[@type = 'settings' and @action = 'modify']">
		<div class="location">
			<xsl:call-template name="entities.help.button" />
		</div>
		<div class="layout">
		<div class="column">
		<form method="post" action="do/" enctype="multipart/form-data">
			<xsl:apply-templates select="." mode="settings.modify" >
				<xsl:with-param name="toggle" select="0"/>
			</xsl:apply-templates>
			<div class="row">
				<xsl:call-template name="std-form-buttons-settings" />
			</div>
		</form>
		<xsl:if test="/result[@method = 'config']">
			<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		</xsl:if>
		<xsl:if test="/result[@module = 'content' and @method = 'content_control']">
			<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		</xsl:if>
		<xsl:if test="/result[@module = 'emarket' and @method = 'social_networks']">
			<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		</xsl:if>
		<xsl:if test="/result[@module = 'search' and @method = 'index_control']">
			<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		</xsl:if>
		<xsl:if test="/result[@module = 'search' and @method = 'index_control']">
			<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		</xsl:if>

		<div class="panel-settings">
			<div class="title">
				<h3>
					&js-emarket-reindex-header;
				</h3>
			</div>
			<div class="content">

				<script type="text/javascript">
					<![CDATA[
					var getReindexResult = function() {
						$.getJSON('/admin/emarket/getLastReindexDate/.json', function (e) {
							if (!e.data.reindexDate && !e.data.reindexResult) {
								$('#lastReindexDate').html(getLabel('js-emarket-reindex-no')).css('color','red');
							} else if (e.data.reindexResult) {
								$('#lastReindexDate').html(e.data.reindexDate).css('color','black');
								$('#lastReindexResult').html(getLabel('js-reindex-success')).css('color','green');
								$('#lastReindexResult').parent().css('display','block');
							} else {
								$('#lastReindexDate').html(e.data.reindexDate).css('color','black');
								$('#lastReindexResult').html(getLabel('js-reindex-fail')).css('color','red');
								$('#lastReindexResult').parent().css('display','block');
							}
						});
					};
					$(function() {
						getReindexResult();
					});
					]]>
					<xsl:if test="not(/result[@demo])">
					<![CDATA[
					$(function() {
						$('#rebuildTopItems').on('click', function() {
							rebuildTopItems()
						});
					});
					function rebuildTopItems() {
						var partialQuery = function(page) {
							if(window.session) {
								window.session.startAutoActions();
							}

							$.get('/admin/emarket/partialRecalc.xml?page='+page, null, function (data) {
								var current = $('index-items', data).attr('current');
								var total = $('index-items', data).attr('total');
								var page = $('index-items', data).attr('page');

								if(parseInt(current) < parseInt(total)) {
									$('#emarket-reindex-log').html(getLabel('js-emarket-reindex-popular-items') + current);
									partialQuery(page);
								} else {
									$('.eip_buttons .ok').css('display','block');
									$('.eip_buttons').css('display','block');
									$('#emarket-reindex-log').html(getLabel('js-emarket-reindex-popular-items') + total);
									$('#processReindex').html(getLabel('js-emarket-reindex-finish')).addClass('textOk');
									getReindexResult();
									return;
								}
							});
						}

						partialQuery(0);

						openDialog('', getLabel('js-emarket-reindex-header'), {
							'html': '<span id="processReindex">' + getLabel('js-emarket-reindex') + '</span>' + '<p id="emarket-reindex-log" />'
						});

						$('.eip_buttons').css('display','none');
						$('.eip_buttons .back').css('display','none');
						return false;
					}
					]]>
					</xsl:if>
				</script>

				<p>&stat-date-reindex;: <span id="lastReindexDate"></span></p>
				<p style="display:none">&stat-result-reindex;: <span id="lastReindexResult"></span></p>

				<div class="buttons emarket_config_btn" id="rebuildTopItems" style="float:right">
					<div>
						<input class="btn color-blue" type="button" value="&order-reindex;"/>
					</div>
				</div>

			</div>
		</div>
		</div>
			<div class="column">
				<xsl:call-template name="entities.help.content" />
			</div>
		</div>
	</xsl:template>

	<xsl:template match="group[@name = 'fields-settings']" mode="settings.modify">
		<xsl:param name="toggle" select="1" />
		<div class="panel-settings">
			<div class="title field-group-toggle">
				<xsl:if test="$toggle = 1 and (count(.) > 1)">
					<div class="round-toggle " />
				</xsl:if>

				<h3><xsl:value-of select="@label" /></h3>
			</div>
			<div class="content">
				<div class="row">
					<div class="col-md-4 group-caption">&label-group-caption-item-property;</div>
					<div class="col-md-4 group-caption">&label-group-caption-item-field;</div>
				</div>
				<xsl:apply-templates select="option" mode="settings.modify" />
			</div>
		</div>
	</xsl:template>

</xsl:stylesheet>
