import React, { Component, Suspense } from "react";
import Entry from "../components/Entry/Entry";

export default class EntryPage extends Component<Props>{
    props: Props;

    render() {
        return (
            <Suspense fallback="">
                <Entry />
            </Suspense>
        );
    }
}