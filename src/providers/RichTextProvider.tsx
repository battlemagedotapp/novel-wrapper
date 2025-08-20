import { createContext, ReactNode, useContext } from "react";

type RichTextContextType = {
    convexSiteUrl: string;
    getImageUrl: (storageId: string) => string;
};

const RichTextContext = createContext<RichTextContextType | undefined>(undefined);

export const RichTextProvider = ({
    convexSiteUrl,
    children,
}: {
    convexSiteUrl: string;
    children: ReactNode;
}) => {
    if (!convexSiteUrl) {
        throw new Error("RichTextProvider requires a convexSiteUrl prop");
    }

    const getImageUrl = (storageId: string) => `${convexSiteUrl}/getImage?storageId=${storageId}`;

    return (
        <RichTextContext.Provider value={{ convexSiteUrl, getImageUrl }}>
            {children}
        </RichTextContext.Provider>
    );
};

export const useRichText = () => {
    const ctx = useContext(RichTextContext);
    if (!ctx) {
        throw new Error("useRichText must be used within a RichTextProvider");
    }
    return ctx;
};

