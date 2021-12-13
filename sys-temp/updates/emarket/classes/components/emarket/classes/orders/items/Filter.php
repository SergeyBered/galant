<?php
	namespace UmiCms\Classes\Components\Emarket\Orders\Items;

	/**
	 * Класс фильтра списка товарных наименований
	 * @package UmiCms\Classes\Components\Emarket\Orders\Items
	 */
	class Filter implements iFilter {

		/** @inheritDoc */
		public function getListByProduct(array $orderItemList, $productId) {
			return array_filter($orderItemList, function(\orderItem $orderItem) use ($productId) {
				$product = $orderItem->getRelatedProduct();
				return ($product instanceof \iUmiHierarchyElement && $product->getId() == $productId);
			});
		}

		/** @inheritDoc */
		public function getFirstByProduct(array $orderItemList, $productId) {
			$list = $this->getListByProduct($orderItemList, $productId);
			return array_shift($list);
		}

		/** @inheritDoc */
		public function getListWithoutProduct(array $orderItemList) {
			return array_filter($orderItemList, function(\orderItem $orderItem) {
				return (!$orderItem->getRelatedProduct() instanceof \iUmiHierarchyElement);
			});
		}

		/** @inheritDoc */
		public function getFirstWithoutProduct(array $orderItemList) {
			$list = $this->getListWithoutProduct($orderItemList);
			return array_shift($list);
		}

		/** @inheritDoc */
		public function getListByTradeOffer(array $orderItemList, $tradeOfferId) {
			return array_filter($orderItemList, function(\orderItem $orderItem) use ($tradeOfferId) {
				return ($orderItem instanceof \TradeOfferOrderItem && $orderItem->getOfferId() == $tradeOfferId);
			});
		}

		/** @inheritDoc */
		public function getFirstByTradeOffer(array $orderItemList, $tradeOfferId) {
			$list = $this->getListByTradeOffer($orderItemList, $tradeOfferId);
			return array_shift($list);
		}

		/** @inheritDoc */
		public function getListByOptions(array $orderItemList, array $optionList) {
			return array_filter($orderItemList, function(\orderItem $orderItem) use ($optionList) {
				return ($orderItem instanceof \optionedOrderItem && $orderItem->hasOptions($optionList));
			});
		}

		/** @inheritDoc */
		public function getFirstByOptions(array $orderItemList, array $optionList) {
			$list = $this->getListByOptions($orderItemList, $optionList);
			return array_shift($list);
		}

		/** @inheritDoc */
		public function getListByEmptyModifier(array $orderItemList) {
			return array_filter($orderItemList, function(\orderItem $orderItem) {
				return $orderItem->containsAppliedModifier() === false;
			});
		}

		/** @inheritDoc */
		public function getFirstByEmptyModifier(array $orderItemList) {
			$list = $this->getListByEmptyModifier($orderItemList);
			return array_shift($list);
		}
	}