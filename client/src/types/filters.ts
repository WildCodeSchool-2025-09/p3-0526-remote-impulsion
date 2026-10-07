export type ReferenceItem = {
  id: number;
  name: string;
};

export type HistoryFilter = "all" | "month" | "week";

export type HistoryFiltersProps = {
  filter: HistoryFilter;
  setFilter: (value: HistoryFilter) => void;
};
