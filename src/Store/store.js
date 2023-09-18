import {configureStore} from '@reduxjs/toolkit';
import {AuthSlice} from '../Redux/AuthSlice';
import {CultivationSlice} from '../Redux/CultivationSlice';
import {CropSlice} from '../Redux/CropSlice';
import { TreeCropSlice } from '../Redux/TreeCropSlice';
import { TreesShrubSlice } from '../Redux/TreesSlice';
import { HuntingCropSlice } from '../Redux/HuntingCropSlice';
import { HuntingSlice } from '../Redux/HuntingSlice';
import { PoultryCropSlice } from '../Redux/PoultryCropSlice';
import { PoultrySlice } from '../Redux/PoultrySlice';
import { StorageMethodSlice } from '../Redux/StorageMethodSlice';
import { StorageSlice } from '../Redux/StorageSlice';
import { SellingChannelMethodSlice } from '../Redux/SellingChannelMethodSlice';
import { SellingChannelSlice } from '../Redux/SellingChannelSlice';
import { FisheryCropSlice } from '../Redux/FisheryCropSlice';
import { FisherySlice } from '../Redux/FisherySlice';
import { OthersSlice } from '../Redux/OthersSlice';
import { ConsumptionTypeSlice } from '../Redux/ConsumptionTypeSlice';
import { ConsumptionCropSlice } from '../Redux/ConsumptionCropSlice';
import { ConsumptionSlice } from '../Redux/ConsumptionSlice';

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    cultivation: CultivationSlice.reducer,
    crop: CropSlice.reducer,
    treeCrop: TreeCropSlice.reducer,
    treeShrub: TreesShrubSlice.reducer,
    huntingCrop: HuntingCropSlice.reducer,
    hunting: HuntingSlice.reducer,
    poultryCrop: PoultryCropSlice.reducer,
    poultry:PoultrySlice.reducer,
    storageMethod : StorageMethodSlice.reducer,
    storage:StorageSlice.reducer,
    sellingChannelMethod:SellingChannelMethodSlice.reducer,
    sellingChannel:SellingChannelSlice.reducer,
    fisheryCrop: FisheryCropSlice.reducer,
    fishery: FisherySlice.reducer,
    Others: OthersSlice.reducer,
    consumptionType: ConsumptionTypeSlice.reducer,
    consumptionCrop: ConsumptionCropSlice.reducer,
    consumption:ConsumptionSlice.reducer
  },
});
