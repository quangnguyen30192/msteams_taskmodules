import * as React from "react";
import {
    Provider,
    Flex,
    Text,
    Button,
    Header,
    teamsTheme,
    teamsDarkTheme,
    teamsHighContrastTheme,
    Input
} from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams, getQueryVariable } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export const VideoSelectorTaskModule = () => {
    const [{ inTeams, theme, context }] = useTeams();
    const [youTubeVideoId, setYouTubeVideoId] = useState<string | undefined>(
        getQueryVariable("vid")
    );

    const handleOnChanged = (event): void => {
        setYouTubeVideoId(event.target.value);
    };

    const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        microsoftTeams.tasks.submitTask(youTubeVideoId, undefined);
    };
    return (
        <Provider theme={theme}>
            <Flex column gap="gap.smaller">
                <Text size="medium">
          Enter the ID of a YouTube video to show in the task module player.
                </Text>
                <Input value={youTubeVideoId} onChange={handleOnChanged}></Input>
                <Button content="Update" primary onClick={handleOnClick}></Button>
            </Flex>
        </Provider>
    );
};
