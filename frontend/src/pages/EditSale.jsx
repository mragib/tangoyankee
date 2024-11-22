import useAttribute from "@/features/attribute/useAttribute";
import usePaymentMethod from "@/features/payment-method/usePaymentMethod";
import EditSaleForm from "@/features/sale/EditSaleForm";
import useSale from "@/features/sale/useSale";
import Spinner from "@/ui/Spinner";

function EditSale() {
  const { sale, isLoading: saleLoading } = useSale();
  const { attribute: productList, isLoading: productLoading } = useAttribute();
  const { paymentMethods, isLoading: paymentMethodLoading } =
    usePaymentMethod();
  const isLoading = saleLoading | productLoading | paymentMethodLoading;
  if (isLoading) return <Spinner />;
  return (
    <EditSaleForm
      sale={sale}
      productList={productList}
      paymentMethods={paymentMethods}
    />
  );
}

export default EditSale;
