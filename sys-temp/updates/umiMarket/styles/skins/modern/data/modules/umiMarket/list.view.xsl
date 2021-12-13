<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE xsl:stylesheet SYSTEM "ulang://common">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/1999/XSL/Transform">

	<!-- Идентификатор активной категории -->
	<xsl:param name="param0"/>

	<!-- Идентификатор активного типа сайта -->
	<xsl:param name="param1"/>

	<!-- Шаблон вкладки "Каталог" -->
	<xsl:template match="/result[@method = 'catalog']/data[@type = 'list' and @action = 'view']">
		<div class="market">
			<div class="shell_section">
				<div class="columns_case">
					<div class="column_fixed">
						<xsl:apply-templates select="menu" mode="market"/>
					</div>
					<div class="column_float">
						<xsl:apply-templates select="products" mode="market"/>
						<xsl:apply-templates select="popularProducts" mode="market"/>
						<xsl:apply-templates select="newProducts" mode="market"/>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон меню вкладки "Каталог" -->
	<xsl:template match="menu" mode="market">
		<div class="vertical_tabs">
			<xsl:apply-templates select="type" mode="market"/>
		</div>
	</xsl:template>

	<!-- Шаблон раздела меню вкладки "Каталог" -->
	<xsl:template match="menu/type" mode="market">
		<xsl:variable name="isActiveType" select="@siteTypeId = $param0" />
		<div>
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="$isActiveType">
						<xsl:text>tab_section active</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>tab_section</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<div class="tab_button">
				<xsl:apply-templates select="@label" />
			</div>
			<div class="tab_content">
				<ul>
					<li>
						<a>
							<xsl:choose>
								<xsl:when test="$isActiveType and not($param1)">
									<xsl:attribute name="class">
										<xsl:text>active</xsl:text>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="href">
										<xsl:value-of select="concat($lang-prefix, '/admin/umiMarket/catalog/', @siteTypeId)" />
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							&label-all-products;
						</a>
					</li>
					<xsl:apply-templates select="category" mode="market">
						<xsl:with-param name="isActiveType" select="$isActiveType" />
					</xsl:apply-templates>
				</ul>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон пункта меню вкладки "Каталог" -->
	<xsl:template match="type/category" mode="market">
		<xsl:param name="isActiveType"/>
		<xsl:variable name="link" select="concat($lang-prefix, '/admin/umiMarket/catalog/', ../@siteTypeId, '/', @id)" />
		<li>
			<a>
				<xsl:choose>
					<xsl:when test="(@id = $param1) and $isActiveType">
						<xsl:attribute name="class">
							<xsl:text>active</xsl:text>
						</xsl:attribute>
					</xsl:when>
					<xsl:when test="@id = $param1">
						<xsl:attribute name="class">
							<xsl:text>active</xsl:text>
						</xsl:attribute>
						<xsl:attribute name="href">
							<xsl:value-of select="$link" />
						</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="href">
							<xsl:value-of select="$link" />
						</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:value-of select="concat(@name, ' (', @count, ')')" />
			</a>
		</li>
	</xsl:template>

	<!-- Шаблон отфильтрованного списка товаров -->
	<xsl:template match="products[@total > 0]" mode="market">
		<div class="main_wrapper">
			<div class="templates_block">
				<div class="block_wrapper">
					<xsl:apply-templates select="item" mode="market"/>
				</div>
			</div>
			<div class="pagination_block clearfix">
				<xsl:apply-templates select="document(concat('udata://system/numpages/', @total, '/',  @limit))/udata" mode="market"/>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон постраничной навигации -->
	<xsl:template match="udata[@module = 'system' and @method = 'numpages']" mode="market">
		<div class="block_wrapper">
			<div class="grid_12 grid_sm_8">
				<div class="pagination">
					<ul class="list_inline">
						<xsl:apply-templates select="toprev_link " mode="market.numpages"/>
						<xsl:apply-templates select="items/item " mode="market.numpages"/>
						<xsl:apply-templates select="tonext_link " mode="market.numpages"/>
					</ul>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон ссылки на предыдущую страницу в рамках постраничной навигации -->
	<xsl:template match="toprev_link" mode="market.numpages">
		<li class="arrow_icon left">
			<a href="{$request-uri}{.}" title="&label-previous-page;" class="prev">
				<i class="sprite_arrow sprite-array_left"/>
			</a>
		</li>
	</xsl:template>

	<!-- Шаблон ссылки на страницу в рамках постраничной навигации -->
	<xsl:template match="item" mode="market.numpages">
		<li>
			<a href="{$request-uri}{@link}" title="&label-page-number; {.}">
				<xsl:value-of select="." />
			</a>
		</li>
	</xsl:template>

	<!-- Шаблон ссылки на текущую страницу в рамках постраничной навигации -->
	<xsl:template match="item[@is-active = '1']" mode="market.numpages">
		<li class="active">
			<a>
				<xsl:value-of select="." />
			</a>
		</li>
	</xsl:template>

	<!-- Шаблон ссылки на следующую страницу в рамках постраничной навигации -->
	<xsl:template match="tonext_link" mode="market.numpages">
		<li class="arrow_icon right">
			<a href="{$request-uri}{.}" title="&label-next-page;" class="next">
				<i class="sprite_arrow sprite-arrow_right"/>
			</a>
		</li>
	</xsl:template>

	<!-- Шаблон списка новых товаров -->
	<xsl:template match="newProducts[@total > 0]" mode="market">
		<div class="main_wrapper">
			<div class="title_part_wrapper">
				<h2 class="like_h1">&label-new-solutions;</h2>
			</div>
			<div class="separate_basic"/>
			<div class="templates_block">
				<div class="block_wrapper">
					<xsl:apply-templates select="item" mode="market"/>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон списка популярных товаров -->
	<xsl:template match="popularProducts[@total > 0]" mode="market">
		<div class="main_wrapper">
			<div class="title_part_wrapper">
				<h2 class="like_h1">&label-popular-templates;</h2>
			</div>
			<div class="separate_basic"/>
			<div class="templates_block">
				<div class="block_wrapper">
					<xsl:apply-templates select="item" mode="market"/>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон превью товара -->
	<xsl:template match="item" mode="market">
		<div>
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="@isModule = '1'">
						<xsl:text>grid_12 grid_sm_6 grid_lg_4 template_item module</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>grid_12 grid_sm_6 grid_lg_4 template_item</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<div class="thumb base_shadow">
				<div class="overlay_block">
					<a href="{@link}" class="button transparent medium" target="_blank">&label-more-info;</a>
					<div class="template_item_pro-price">
						<xsl:apply-templates select="@rate" mode="market"/>
						<xsl:apply-templates select="@price" mode="market"/>
					</div>
				</div>
				<xsl:apply-templates select="@image" mode="market"/>
			</div>
			<div class="heading">
				<div class="template_title">
					<xsl:value-of select="@name"/>
				</div>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон изображения товара -->
	<xsl:template match="@image" mode="market">
		<xsl:if test="../@isModule != '1'">
			<div class="item_bord"/>
		</xsl:if>
		<div class="template_img">
			<img src="{.}" alt="{../@name}" title="{../@name}" />
		</div>
	</xsl:template>

	<!-- Шаблон рейтинга товара -->
	<xsl:template match="@rate" mode="market">
		<xsl:variable name="rate" select="number(.)" />
		<div class="votes">
			<div class="star_1 current_{$rate}">
				<a></a>
				<div class="star_2 current_{$rate}">
					<a></a>
					<div class="star_3 current_{$rate}">
						<a></a>
						<div class="star_4 current_{$rate}">
							<a></a>
							<div class="star_5 current_{$rate}">
								<a></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>

	<xsl:template match="@price" mode="market">
		<div class="price">
			<xsl:choose>
				<xsl:when test=". > 0">
					<xsl:value-of select="." /> &label-ruble;
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>Бесплатно</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</div>
	</xsl:template>

	<!-- Шаблон пустого отфильтрованного списка товаров -->
	<xsl:template match="products" mode="market"/>

	<!-- Шаблон пустого списка новых товаров -->
	<xsl:template match="newProducts" mode="market"/>

	<!-- Шаблон пустого списка популярных товаров -->
	<xsl:template match="popularProducts" mode="market"/>

	<!-- Шаблон вкладки "Решения" -->
	<xsl:template match="/result[@method = 'solutions']/data">
		<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		<div class="tabs-content module" data-is-last-version="{@is-last-version}">
			<div class="section selected">
				<div class="location">
					<xsl:call-template name="entities.help.button" />
				</div>
				<xsl:apply-templates select="document('udata://system/listErrorMessages')/udata/items" mode="config.error"/>
				<div class="layout">
					<div class="column">
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&label-domains-without-solutions;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-install;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:choose>
											<xsl:when test="/result/data/domain[not(solution)]">
												<xsl:apply-templates select="/result/data/domain[not(solution)]" mode="solution.list"/>
											</xsl:when>
											<xsl:otherwise>
												<tr>
													<td class="solution_table_header">&label-domains-have-solutions;</td>
													<td/>
												</tr>
											</xsl:otherwise>
										</xsl:choose>
									</tbody>
								</table>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&label-domains-with-solutions;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-delete;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:choose>
											<xsl:when test="/result/data/domain[solution]">
												<xsl:apply-templates select="/result/data/domain[solution]" mode="solution.list"/>
											</xsl:when>
											<xsl:otherwise>
												<tr>
													<td class="solution_table_header">&label-domains-have-not-solutions;</td>
													<td/>
												</tr>
											</xsl:otherwise>
										</xsl:choose>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>
		</div>
		<link rel="stylesheet" type="text/css" href="/styles/common/js/node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css?{$system-build}" />
		<script type="text/javascript" charset="utf-8" src="/styles/common/js/node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js?{$system-build}" />
		<script type="text/javascript" charset="utf-8"
				src="/styles/skins/modern/data/modules/umiMarket/ComponentInstaller.js?{$system-build}" />
	</xsl:template>

	<!-- Шаблон ошибки получения списка доменов с установленными решениями -->
	<xsl:template match="domain[error]" mode="solution.list">
		<tr>
			<td>
				<p>&error-label-available-module-list;</p>
				<p>
					<xsl:value-of select="error" disable-output-escaping="yes"/>
				</p>
			</td>
			<td class="center"/>
		</tr>
	</xsl:template>

	<!-- Шаблон домена с установленным решением -->
	<xsl:template match="domain[solution]" mode="solution.list">
		<tr>
			<td class="solution_table_header">
				<xsl:apply-templates select="." mode="solution.list.row"/>
			</td>
			<td class="center">
				<xsl:apply-templates select="." mode="delete.button"/>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон кнопки удаления -->
	<xsl:template match="domain[solution]" mode="delete.button">
		<a href="{$lang-prefix}/admin/umiMarket/deleteSolution/{solution/@name}/{@id}" title="&label-delete;" class="delete" data-type="solution">
			<i class="small-ico i-remove"/>
		</a>
	</xsl:template>

	<!-- Шаблон кнопки удаления для пользовательского шаблона -->
	<xsl:template match="domain[solution[@isCustom = '1']]" mode="delete.button">
		<a class="custom_solution_delete">
			<i class="small-ico i-alert" title="&label-custom-site-alert;"/>
		</a>
	</xsl:template>

	<!-- Шаблон установленного решения -->
	<xsl:template match="domain" mode="solution.list.row">
		<a>
			<xsl:value-of select="@host" />
		</a>
		&nbsp;
		<span class="solution_title">
			<xsl:value-of select="solution/@title"/>
		</span>
		&nbsp;
		<xsl:apply-templates select="solution" mode="solution.image" />
	</xsl:template>

	<!-- Шаблон кнопки предпросмотра шаблона -->
	<xsl:template match="solution[@isCustom = '0']" mode="solution.image">
		<i class="solution_info small-ico i-zoom" title="&label-more-info;" />
		<a class="solution_image" href="{./@image}" title="{./@title}" data-caption="{./@title}">
			<img src="{./@thumb}" alt="{./@title}" />
		</a>
	</xsl:template>

	<!-- Шаблон неустановленного решения -->
	<xsl:template match="domain" mode="solution.list">
		<tr>
			<td class="solution_table_header">
				<a>
					<xsl:value-of select="@host" />
				</a>
			</td>
			<td class="center">
				<a data-component="all" data-type="solution" data-domain-id="{@id}" title="&label-install;">
					<i class="small-ico i-upload"/>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон вкладки "Модули" -->
	<xsl:template match="/result[@method = 'modules']/data">
		<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />
		<div class="tabs-content module" data-is-last-version="{@is-last-version}">
			<div class="section selected">
				<div class="location">
					<xsl:call-template name="entities.help.button" />
				</div>
				<xsl:apply-templates select="document('udata://system/listErrorMessages')/udata/items" mode="config.error"/>
				<div class="layout">
					<div class="column">
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&module-list-available-for-installing;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-install;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:choose>
											<xsl:when test="available-module">
												<xsl:apply-templates select="available-module" mode="list-view"/>
											</xsl:when>
											<xsl:otherwise>
												<tr>
													<td>&all-available-modules-installed;</td>
													<td/>
												</tr>
											</xsl:otherwise>
										</xsl:choose>
									</tbody>
								</table>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&label-modules-list;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-delete;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:apply-templates select="module" mode="list-view"/>
									</tbody>
								</table>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<form action="{$lang-prefix}/admin/umiMarket/addModule/" enctype="multipart/form-data" method="post">
									<div class="field modules">
										<div>
											<div class="title-edit">
												<xsl:text>&label-install-path;</xsl:text>
											</div>
											<input value="classes/components/" class="default module-path" name="module_path" />
											<input type="submit" class="btn color-blue install-btn" value="&label-install;" />
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>
		</div>
		<script src="/styles/skins/modern/data/modules/umiMarket/ComponentInstaller.js?{$system-build}" />
	</xsl:template>

	<!-- Шаблон для отображение списка ошибок -->
	<xsl:template match="udata[@module = 'system' and @method = 'listErrorMessages']/items" mode="config.error">
		<div class="column">
			<div id="errorList">
				<p class="error"><strong>&js-label-errors-found;</strong></p>
				<ol class="error">
					<xsl:apply-templates select="item" mode="config.error"/>
				</ol>
			</div>
		</div>
	</xsl:template>

	<!-- Шаблон для отображения одной ошибки в списке -->
	<xsl:template match="items/item" mode="config.error">
		<li>
			<xsl:value-of select="." disable-output-escaping="yes"/>
		</li>
	</xsl:template>

	<!-- Шаблон строки в списке модулей, доступных для установки -->
	<xsl:template match="available-module" mode="list-view">
		<tr>
			<td>
				<a>
					<xsl:value-of select="@label" />
				</a>
			</td>
			<td class="center">
				<a data-component="{.}" title="&label-install;">
					<i class="small-ico i-upload"/>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон вывода ошибки формирования списка доступных модулей или расширений -->
	<xsl:template match="available-module[@error]|available-extension[@error]" mode="list-view">
		<tr>
			<td>
				<p>&error-label-available-module-list;</p>
				<p>
					<xsl:value-of select="@error" disable-output-escaping="yes"/>
				</p>
			</td>
			<td class="center"/>
		</tr>
	</xsl:template>

	<!-- Шаблон строки в списке установленных модулей -->
	<xsl:template match="module" mode="list-view">
		<tr>
			<td>
				<a href="{$lang-prefix}/admin/{.}/">
					<xsl:value-of select="@label" />
				</a>
			</td>
			<td class="center">
				<a href="{$lang-prefix}/admin/umiMarket/deleteModule/{.}/" title="&label-delete;" class="delete" data-type="module">
					<i class="small-ico i-remove"/>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон вкладки "Расширения" -->
	<xsl:template match="/result[@method = 'extensions']/data">

		<xsl:apply-templates select="/result/@demo" mode="stopdoItInDemo" />

		<div class="tabs-content module" data-is-last-version="{@is-last-version}">
			<div class="section selected">
				<div class="location">
					<xsl:call-template name="entities.help.button" />
				</div>
				<xsl:apply-templates select="document('udata://system/listErrorMessages')/udata/items" mode="config.error"/>
				<div class="layout">
					<div class="column">
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&extension-list-available-for-installing;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-install;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:choose>
											<xsl:when test="available-extension">
												<xsl:apply-templates select="available-extension" mode="list-view"/>
											</xsl:when>
											<xsl:otherwise>
												<tr>
													<td>&all-available-extensions-installed;</td>
													<td/>
												</tr>
											</xsl:otherwise>
										</xsl:choose>
									</tbody>
								</table>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<table class="btable btable-striped bold-head">
									<thead>
										<th>
											<xsl:text>&label-extensions-list;</xsl:text>
										</th>
										<th>
											<xsl:text>&label-delete;</xsl:text>
										</th>
									</thead>
									<tbody>
										<xsl:apply-templates select="installed-extension" mode="list-view"/>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="column">
						<xsl:call-template name="entities.help.content" />
					</div>
				</div>
			</div>
		</div>
		<script src="/styles/skins/modern/data/modules/umiMarket/ComponentInstaller.js?{$system-build}" />
	</xsl:template>


	<!-- Шаблон строки в списке расширений, доступных для установки -->
	<xsl:template match="available-extension" mode="list-view">
		<tr>
			<td>
				<a>
					<xsl:value-of select="@label" />
				</a>
			</td>
			<td class="center">
				<a data-component="{.}" data-type="extension" title="&label-install;">
					<i class="small-ico i-upload"/>
				</a>
			</td>
		</tr>
	</xsl:template>

	<!-- Шаблон строки в списке установленных расширений -->
	<xsl:template match="installed-extension" mode="list-view">
		<tr>
			<td>
				<a>
					<xsl:value-of select="@label" />
				</a>
			</td>
			<td class="center">
				<a href="{$lang-prefix}/admin/umiMarket/deleteExtension/{.}/" title="&label-delete;" class="delete" data-type="extension">
					<i class="small-ico i-remove"/>
				</a>
			</td>
		</tr>
	</xsl:template>

</xsl:stylesheet>