<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">

<xsl:stylesheet version="1.0"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:php="http://php.net/xsl"
				xmlns:umi="http://www.w3.org/1999/xhtml">
	<!-- Переменная со списком языков -->
	<xsl:variable name="lang-items" select="document('udata://system/getLangsList/')/udata/items/item" />

	<!-- Шаблон вкладки "Языки" -->
	<xsl:template match="/result[@method = 'langs']/data[@type = 'list' and @action = 'modify']">
		<div class="tabs-content module">
			<div class="section selected">
				<div class="location" xmlns:umi="http://www.umi-cms.ru/TR/umi">
					<xsl:call-template name="entities.help.button" />
				</div>

				<div class="layout">
					<div class="column">
						<form id="{../@module}_{../@method}_form" action="do/" method="post">
							<table class="btable btable-striped bold-head middle-align">
								<thead>
									<tr>
										<th>
											<xsl:text>&label-langs-list;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-lang-prefix;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-delete;</xsl:text>
										</th>
									</tr>
								</thead>
								<tbody>
									<xsl:apply-templates mode="list-modify"/>
									<tr>
										<td>
											<input type="text" class="default" name="data[new][title]" />
										</td>
										<td>
											<input type="text" class="default" name="data[new][prefix]" />
										</td>
										<td />
									</tr>
								</tbody>
							</table>
							<div class="row">
								<xsl:call-template name="std-form-buttons-settings" />
							</div>
						</form>

					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>
		</div>

		<xsl:apply-templates select="../@demo" mode="stopdoItInDemo" />
	</xsl:template>

	<!-- Язык в списке языков -->
	<xsl:template match="lang" mode="list-modify">
		<tr>
			<td>
				<input type="text" class="default" name="data[{@id}][title]" value="{@title}"/>
			</td>

			<td>
				<input type="text" class="default" name="data[{@id}][prefix]" value="{@prefix}"/>
			</td>

			<td class="center">
				<a href="{$lang-prefix}/admin/config/lang_del/{@id}/" class="delete unrestorable {/result/@module}_{/result/@method}_btn">
					<i class="small-ico i-remove"></i>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон вкладки "Домены" -->
	<xsl:template match="/result[@method = 'domains']/data">
		<script type="text/javascript">
			jQuery(function() {
				jQuery('.<xsl:value-of select="../@module" />_<xsl:value-of select="../@method" />_btn.refresh').on('click', function(){
					var id = this.rel;
					updateSitemap(id);
					return false;
				});
			});

			<![CDATA[
			jQuery(function() {
				$('form').on('submit', function() {
					var inputs = $('input[name$="][host]"]'),
						new_val = $('input[name="data[new][host]"]').val();
					if (inputs.length > 0){
						for (var i=0, cnt=inputs.length-1; i < cnt; i++){
							if ($(inputs[i]).val() == new_val){
								alert(getLabel('js-error-domain-already-exists'));
								return false;
							}
						}
					}
					return true;
				});
			});

			/**
			 * Обработчик выбора фавикона
			 * @param {String} filePath путь до выбранного файла
			 * @param {String} filePathContainerId идентификатор контейнера пути выбранного файла
		 	 */
			var onChooseFavicon = function(filePath, filePathContainerId){
				var $filePathContainer = $('#' + filePathContainerId);
				var $imageContainer = $filePathContainer.parent().parent().parent().siblings('img');
				var faviconExtList = ['ico', 'png', 'svg', 'jpeg', 'gif', 'jpg', 'webp'];

				if (typeof filePath === 'string' && faviconExtList.indexOf(filePath.toLowerCase().split('.').pop()) >= 0) {
					$imageContainer.removeClass('hidden');
					$imageContainer.attr('src', filePath);
					return;
				}

				$imageContainer.addClass('hidden');
				$filePathContainer.val('');
				$filePathContainer.trigger('change');

				$.jGrowl(getLabel('js-error-incorrect-favicon'), {
					'header': 'UMI.CMS',
					'life': 10000
				});
			};
		]]></script>

		<div class="tabs-content module">
			<div class="section selected">
				<div class="location" xmlns:umi="http://www.umi-cms.ru/TR/umi">
					<xsl:call-template name="entities.help.button" />
				</div>

				<div class="layout">
					<div class="column">
						<form id="{../@module}_{../@method}_form" action="do/" method="post">
							<table class="btable btable-striped bold-head middle-align">
								<thead>
									<tr>
										<th colspan="4">
											<xsl:text>&label-domain-address;</xsl:text>
										</th>
										<th colspan="3">
											<xsl:text>&label-domain-lang;</xsl:text>
										</th>
										<th colspan="1">
											<xsl:text>&label-use-ssl;</xsl:text>
										</th>
										<th colspan="1">
											<xsl:text>&label-favicon;</xsl:text>
										</th>
										<th colspan="1">
											<xsl:text>&label-mirrows;</xsl:text>
										</th>
										<th colspan="2">
											<xsl:text>&label-delete;</xsl:text>
										</th>
									</tr>
								</thead>
								<tbody>
									<xsl:apply-templates mode="list-modify"/>
									<tr>
										<td colspan="4">
											<input type="text" class="default" name="data[new][host]" />
										</td>
										<td class="center" colspan="3">
											<select class="default newselect" name="data[new][lang_id]">
												<xsl:apply-templates select="$lang-items" mode="std-form-item" />
											</select>
										</td>
										<td class="center" colspan="1">
											<input type="hidden" value="0" name="data[new][using-ssl]"/>
											<div class="checkbox">
												<input type="checkbox" class="check" id="data[new][using-ssl]" name="data[new][using-ssl]" value="1"/>
											</div>
										</td>
										<xsl:call-template name="favicon">
											<xsl:with-param name="domain.id">
												<xsl:value-of select="'new'"/>
											</xsl:with-param>
										</xsl:call-template>
										<td colspan="7"/>
									</tr>
								</tbody>
							</table>
							<div class="row">
								<xsl:call-template name="std-form-buttons-settings" />
							</div>
						</form>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>
		</div>

		<xsl:apply-templates select="../@demo" mode="stopdoItInDemo" />
	</xsl:template>

	<!-- Домен в списке доменов -->
	<xsl:template match="domain" mode="list-modify">

		<tr>
			<td colspan="4">
				<input type="text" class="default" name="data[{@id}][host]" value="{@host}" />
			</td>

			<td class="center" colspan="3">
				<select class="default newselect" name="data[{@id}][lang_id]">
					<xsl:apply-templates select="$lang-items" mode="std-form-item">
						<xsl:with-param name="value" select="@lang-id" />
					</xsl:apply-templates>
				</select>
			</td>

			<td class="center" colspan="1">
				<input type="hidden" value="0" name="data[{@id}][using-ssl]"/>
				<div class="checkbox">
					<input type="checkbox" class="check" id="data[{@id}][using-ssl]" name="data[{@id}][using-ssl]" value="1" >
						<xsl:if test="@using-ssl = '1'">
							<xsl:attribute name="checked">checked</xsl:attribute>
						</xsl:if>
					</input>
				</div>
			</td>

			<xsl:call-template name="favicon">
				<xsl:with-param name="domain.id">
					<xsl:value-of select="@id"/>
				</xsl:with-param>
				<xsl:with-param name="filepath">
					<xsl:value-of select="@icon-relative-path"/>
				</xsl:with-param>
				<xsl:with-param name="directory">
					<xsl:value-of select="@icon-folder"/>
				</xsl:with-param>
			</xsl:call-template>

			<td align="center" colspan="1">
				<a href="{$lang-prefix}/admin/config/domain_mirrows/{@id}/" class="subitems" >
					<i class="small-ico i-edit" title="&label-edit;" alt="&label-edit;"></i>
				</a>
			</td>

			<td class="center" colspan="1">
				<a href="{$lang-prefix}/admin/config/domain_del/{@id}/" class="delete unrestorable {/result/@module}_{/result/@method}_btn"
					onclick="javascript:deleteCookie('control-domain-id')">
					<i class="small-ico i-remove" title="&label-delete;" alt="&label-delete;"></i>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Домен по-умолчанию в списке доменов -->
	<xsl:template match="domain[@is-default = '1']" mode="list-modify">
		<tr>
			<td colspan="4">
				<input type="text" class="default" name="data[{@id}][host]" value="{@host}" disabled="disabled" />
			</td>

			<td class="center" colspan="3">
				<select class="default newselect" name="data[{@id}][lang_id]">
					<xsl:apply-templates select="$lang-items" mode="std-form-item">
						<xsl:with-param name="value" select="@lang-id" />
					</xsl:apply-templates>
				</select>
			</td>

			<td class="center" colspan="1">
				<input type="hidden" value="0" name="data[{@id}][using-ssl]"/>
				<div class="checkbox">
					<input type="checkbox" class="check" id="data[{@id}][using-ssl]" name="data[{@id}][using-ssl]" value="1" >
						<xsl:if test="@using-ssl = '1'">
							<xsl:attribute name="checked">checked</xsl:attribute>
						</xsl:if>
					</input>
				</div>
			</td>

			<xsl:call-template name="favicon">
				<xsl:with-param name="domain.id">
					<xsl:value-of select="@id"/>
				</xsl:with-param>
				<xsl:with-param name="filepath">
					<xsl:value-of select="@icon-relative-path"/>
				</xsl:with-param>
				<xsl:with-param name="directory">
					<xsl:value-of select="@icon-folder"/>
				</xsl:with-param>
			</xsl:call-template>

			<td align="center" colspan="1">
				<a href="{$lang-prefix}/admin/config/domain_mirrows/{@id}/" class="subitems">
					<i class="small-ico i-edit" title="&label-edit;" alt="&label-edit;"></i>
				</a>
			</td>

			<td colspan="1"/>
		</tr>
	</xsl:template>

	<!-- Шаблон поля для ввода favicon -->
	<xsl:template name="favicon">
		<xsl:param name="domain.id"/>
		<xsl:param name="filepath"><xsl:text/></xsl:param>
		<xsl:param name="directory">./images/cms/data</xsl:param>
		<td class="favicon" colspan="1">
			<div class="img_file" id="{generate-id()}"
				 umi:input-name="data[{$domain.id}][favicon]"
				 umi:field-type="img_file"
				 umi:name="data[{$domain.id}][favicon]"
				 umi:lang="{/result/@interface-lang}"
				 umi:filemanager="elfinder"
				 umi:file="{$filepath}"
				 umi:folder="{$directory}"
				 umi:on_get_file_function="onChooseFavicon"
				 umi:folder-hash="{php:function('elfinder_get_hash', string($directory))}"
				 umi:file-hash="{php:function('elfinder_get_hash', string($filepath))}">
				<label for="imageField_{generate-id()}">
					<div class="layout-row-icon" id="imageField_{generate-id()}"/>
				</label>
			</div>
		</td>
	</xsl:template>

	<xsl:template match="group" mode="settings-modify">
		<div class="panel-settings">
			<div class="title">
				<h3><xsl:value-of select="@label" /></h3>
			</div>
			<div class="content">
				<table class="btable btable-striped middle-align">
					<tbody>
						<xsl:apply-templates select="option" mode="settings-modify" />
					</tbody>
				</table>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="option" mode="settings-modify">
		<tr>
			<td width="40%">
				<div class="title-edit">
					<xsl:value-of select="@label" />
				</div>
			</td>

			<td width="60%">
				<input type="text" name="{@name}" id="{@name}" value="{.}" class="default" />
			</td>
		</tr>
	</xsl:template>
</xsl:stylesheet>
