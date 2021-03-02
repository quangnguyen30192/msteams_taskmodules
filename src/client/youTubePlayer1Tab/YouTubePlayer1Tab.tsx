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
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of the YouTube Player 1 content page
 */
export const YouTubePlayer1Tab = () => {
    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [youTubeVideoId, setYouTubeVideoId] = useState<string>("VlEH4vtaxp4");

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    const appRoot = (): string => {
        if (typeof window === "undefined") {
            return "https://{{HOSTNAME}}";
        } else {
            return window.location.protocol + "//" + window.location.host;
        }
    };

    const onShowVideo = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const taskModuleInfo = {
            title: "YouTube Player" + appRoot(),
            url: appRoot() + `/youTubePlayer1Tab/player.html?vid=${youTubeVideoId}`,
            width: 1000,
            height: 700
        };
        microsoftTeams.tasks.startTask(taskModuleInfo);
    };

    const onChangeVideo = (
        event: React.MouseEvent<HTMLButtonElement>
    ): void => {
        const taskModuleInfo = {
            title: "YouTube Video Selector",
            url: appRoot() + `/youTubePlayer1Tab/selector.html?theme={theme}&vid=${youTubeVideoId}`,
            width: 350,
            height: 150
        };

        const submitHandler = (err: string, result: string): void => {
            console.log(err);
            setYouTubeVideoId(result);
        };

        microsoftTeams.tasks.startTask(taskModuleInfo, submitHandler);

    };

    const onChangeVideoAdaptiveCard = (event: React.MouseEvent<HTMLButtonElement>): void => {
        // load adaptive card
        const adaptiveCard: any = require("./YouTubeSelectorCard.json");
        // update card with current video ID
        adaptiveCard.body.forEach((container: any) => {
            if (container.type === "Container") {
                container.items.forEach((item: any) => {
                    if (item.id && item.id === "youTubeVideoId") {
                        item.value = youTubeVideoId;
                    }
                });
            }
        });

        const taskModuleInfo = {
            title: "YouTube Video Selector",
            card: adaptiveCard,
            width: 350,
            height: 250
        };

        const submitHandler = (err: string, result: any): void => {
            console.log(err);
            setYouTubeVideoId(result.youTubeVideoId);
        };

        microsoftTeams.tasks.startTask(taskModuleInfo, submitHandler);
    };

    return (
        <Provider theme={theme}>
            <Flex
                fill={true}
                column
                styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                <Flex.Item>
                    <Header content="This is your tab" />
                </Flex.Item>
                <Flex.Item>
                    <div>
                        <div>
                            <Text content={entityId} />
                        </div>

                        <div>
                            <Button onClick={() => alert("It worked!")}>
                                A sample button
                            </Button>
                        </div>
                    </div>
                </Flex.Item>
                <Flex.Item
                    styles={{
                        padding: ".8rem 0 .8rem .5rem"
                    }}>
                    <Text size="smaller" content="(C) Copyright Personio" />
                </Flex.Item>
                <Header>Task Module Demo</Header>
                <Text>YouTube Video ID:</Text>
                <Input value={youTubeVideoId} disabled></Input>
                <Button content="Change Video ID" onClick={onChangeVideo}></Button>
                <Button content="Change Video ID (AdaptiveCard)" onClick={onChangeVideoAdaptiveCard}></Button>
                <Button content="Show Video" primary onClick={onShowVideo}></Button>
            </Flex>
        </Provider>
    );
};
