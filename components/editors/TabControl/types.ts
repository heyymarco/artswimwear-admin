// types:
export interface TabControlOption<TValue extends any = string>
{
    value    : TValue
    label   ?: React.ReactNode
    content ?: React.ReactNode
}
