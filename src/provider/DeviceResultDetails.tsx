
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { DeviceResponse } from "@/types";
import { InfoIcon } from "lucide-react";


const DeviceResultDetails = ({ device }: { device: DeviceResponse }) => {
    return (
        <div>
            <Item>
                <ItemMedia variant="icon">
                    <InfoIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>{device.deviceName}</ItemTitle>
                    <ItemDescription>{device.deviceToken}</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button>Action</Button>
                </ItemActions>
            </Item>
        </div>
    );
};

export default DeviceResultDetails;