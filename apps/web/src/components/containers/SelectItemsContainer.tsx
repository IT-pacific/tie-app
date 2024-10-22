import { stockItems } from "@/constants/Orders";
import DataTable from "../common/DataTable";
import { ItemsColumns } from "../common/ItemColumns";
import { AppDispatch, AppState, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllItems } from "@/services/inventories/inventory.service";
import { fetchItems } from "@/store/actions/itemAction";
import { items } from "@/types";

type Props = {
 
  selectedItems: string[] | null;
  handleItemSelection: (itemId: string) => void;
};
const SelectItemsContainer = ({
  selectedItems,
  handleItemSelection, 

}: Props) => {
  const { items } = useAppSelector((state: AppState) => state.items);
  
  const { fetchLoading } = useAppSelector((state: AppState) => state.items);
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(!items?.length) dispatch(fetchItems())
  },[dispatch])
  return (
    <div>
<DataTable
      columns={ItemsColumns}
      data={items?(items as items[]):[]}
      selectable
      limit={5}
      page={0}
      loading={fetchLoading}
      selectedItems={selectedItems}
      handleItemSelection={handleItemSelection}
      ColumnsNames={["name", "quantity", "price"]}
      actions
      />
    
    </div>
    
  );
};

export default SelectItemsContainer;
